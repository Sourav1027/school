// CustomSnackbar.tsx
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const CustomSnackbar = async (title: string, text: string, confirmText: string, cancelText: string) => {
  const MySwal = withReactContent(Swal);

  return MySwal.fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
  });
};

export default CustomSnackbar;
