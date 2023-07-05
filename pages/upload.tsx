
import { CldUploadWidget } from 'next-cloudinary';
export default function A() {
  return (
    <div>
      <h1>aaa</h1>

      <CldUploadWidget  uploadPreset="slippayment" options={{
        sources: ['local']

      }}>

        {({ cloudinary, widget, open }) => {

          function handleOnClick(e: any) {
            e.preventDefault();
            open();
          }
          return (
            <button className="button" onClick={handleOnClick}>
              Upload an Image
            </button>
          );
        }}
      </CldUploadWidget>

    </div>

  )

}
