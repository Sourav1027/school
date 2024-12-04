import React from 'react'
type IconProps = React.HTMLAttributes<SVGElement>
const DashCodeLogo = (props: IconProps) => {
    return (
        <>
            <svg
                {...props}
                xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"   width="32" height="320=" viewBox="0 0 32 32">
                  <path d="M0 6C0 2.68629 2.68629 0 6 0H26C29.3137 0 32 2.68629 32 6V32H6C2.68629 32 0 29.3137 0 26V6Z" fill="currentColor" />
  
   <g transform="translate(4, 4) scale(1.5)">
 <image xlinkHref="data:image/png;base64,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"
  x="-7" y="-4" width="28" height="25" fill="#fff"/>
   </g>
   </svg>


        </>
    )
}

export default DashCodeLogo
