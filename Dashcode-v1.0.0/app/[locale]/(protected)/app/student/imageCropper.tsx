import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ImageIcon, Loader2, Upload } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import ReactCrop, { type Crop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface Point {
    x: number;
    y: number;
}

interface Size {
    width: number;
    height: number;
}

interface CropBox extends Point, Size { }

interface ImageCropperProps {
    onImageCropped: (croppedImage: File) => void;
    aspectRatio: number;
}

const REMOVE_BG_API_KEY = 'i2z9ji2tBgeaLzVWeGEQ8dh9';

function centerAspectCrop(
    mediaWidth: number,
    mediaHeight: number,
    aspect: number,
): Crop {
    return centerCrop(
        makeAspectCrop(
            {
                unit: '%',
                width: 90,
            },
            aspect,
            mediaWidth,
            mediaHeight,
        ),
        mediaWidth,
        mediaHeight,
    )
}

const ImageCropper: React.FC<ImageCropperProps> = ({ onImageCropped, aspectRatio = 1 }) => {
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [croppedImagePreview, setCroppedImagePreview] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isRemovingBg, setIsRemovingBg] = useState<boolean>(false);
    const [crop, setCrop] = useState<Crop>();
    const [completedCrop, setCompletedCrop] = useState<Crop>();
    const [imgSrc, setImgSrc] = useState('');

    const imageRef = useRef<HTMLImageElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
        if (aspectRatio) {
            const { width, height } = e.currentTarget;
            const newCrop = centerAspectCrop(width, height, aspectRatio);
            setCrop(newCrop);
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.size <= 10 * 1024 * 1024) {
            setSelectedImage(file);
            setIsDialogOpen(true);
            setError(null);
            // Create a URL for the image
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                setImgSrc(reader.result?.toString() || '');
            });
            reader.readAsDataURL(file);
        } else {
            setError('File size should be less than 10MB');
        }
    };

    const removeBackground = async (imageDataUrl: string): Promise<Blob | null> => {
        const formData = new FormData();
        const blob = dataURLtoBlob(imageDataUrl);
        formData.append('image_file', blob, 'image.png');
        formData.append('size', 'auto');

        try {
            const response = await fetch('https://api.remove.bg/v1.0/removebg', {
                method: 'POST',
                headers: {
                    'X-Api-Key': REMOVE_BG_API_KEY,
                },
                body: formData,
            });

            if (!response.ok) throw new Error(`Remove.bg API error: ${response.statusText}`);

            return await response.blob();
        } catch (error) {
            console.error('Error removing background:', error);
            setError('Failed to remove background. Please try again.');
            return null;
        }
    };

    const dataURLtoBlob = (dataURL: string): Blob => {
        const byteString = atob(dataURL.split(',')[1]);
        const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
        return new Blob([ab], { type: mimeString });
    };

    const getCroppedImage = async (): Promise<File | null> => {
        if (!imageRef.current || !completedCrop?.width || !completedCrop?.height) return null;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return null;

        const scaleX = imageRef.current.naturalWidth / imageRef.current.width;
        const scaleY = imageRef.current.naturalHeight / imageRef.current.height;

        // Set canvas size based on crop dimensions
        canvas.width = completedCrop.width;
        canvas.height = completedCrop.height;

        // Draw the cropped image onto the canvas
        ctx.drawImage(
            imageRef.current,
            completedCrop.x * scaleX,
            completedCrop.y * scaleY,
            completedCrop.width * scaleX,
            completedCrop.height * scaleY,
            0,
            0,
            completedCrop.width,
            completedCrop.height
        );

        const croppedImageDataUrl = canvas.toDataURL('image/png');

        // If user wants to remove background
        if (isRemovingBg) {
            const processedBlob = await removeBackground(croppedImageDataUrl);
            if (processedBlob) return new File([processedBlob], 'cropped-bg-removed.png', { type: 'image/png' });
        }

        // Return regular cropped image without background removal
        const blob = dataURLtoBlob(croppedImageDataUrl);
        return new File([blob], 'cropped.png', { type: 'image/png' });
    };

    const handleSave = async () => {
        if (!completedCrop?.width || !completedCrop?.height) {
            setError('Please make a crop selection');
            return;
        }

        setIsProcessing(true);
        try {
            const croppedImage = await getCroppedImage();
            if (croppedImage) {
                const previewUrl = URL.createObjectURL(croppedImage);
                setCroppedImagePreview(previewUrl);
                onImageCropped(croppedImage);
                setIsDialogOpen(false);
            }
        } catch (error) {
            console.error('Error processing image:', error);
            setError('Failed to process image. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleChoosePhotoClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div>
                <div className="flex flex-col items-center justify-center">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                    <Button 
                        type="button" 
                        className="mt-0 bg-blue-600 hover:bg-blue-700"
                        onClick={handleChoosePhotoClick}
                    >
                        <Upload className="w-4 h-4 mr-2" />
                        Choose Photo
                    </Button>
                </div>

                {error && <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="flex flex-col p-6 absolute top-0 left-0 right-0 inset-0 mx-auto max-w-full h-auto overflow-y-auto rounded-lg"
                style={{ marginTop: '0px', transform: 'none', maxWidth: '500px', width: '70%', height: '55vh' }}>                    
                <DialogHeader>
                        <DialogTitle className="text-xl font-semibold">Crop Image & Remove Background</DialogTitle>
                    </DialogHeader>

                    <div className="mt-4 space-y-4">
                        {Boolean(imgSrc) && (
                            <ReactCrop
                                crop={crop}
                                onChange={(_, percentCrop) => setCrop(percentCrop)}
                                onComplete={(c) => setCompletedCrop(c)}
                                aspect={aspectRatio}
                            >
                                <img
                                    ref={imageRef}
                                    alt="Crop me"
                                    src={imgSrc}
                                    onLoad={onImageLoad}
                                    className="max-w-full max-h-[70vh] object-contain"
                                />
                            </ReactCrop>
                        )}

                        <div className="flex items-center mt-4">
                            <input
                                type="checkbox"
                                checked={isRemovingBg}
                                onChange={() => setIsRemovingBg(!isRemovingBg)}
                                className="mr-2"
                            />
                            <label className="text-sm text-gray-700">Remove background</label>
                        </div>
                    </div>

                    <DialogFooter className="mt-6 space-x-2">
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isProcessing}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSave}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            disabled={isProcessing || !completedCrop?.width || !completedCrop?.height}
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                'Save Photo'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ImageCropper;