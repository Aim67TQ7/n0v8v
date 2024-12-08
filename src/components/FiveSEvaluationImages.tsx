interface FiveSEvaluationImagesProps {
  images: { image_url: string }[];
}

export const FiveSEvaluationImages = ({ images }: FiveSEvaluationImagesProps) => {
  // Create an array of 4 elements, filled with actual images or undefined
  const displayImages = Array(4).fill(undefined).map((_, index) => images[index]);

  return (
    <div className="grid grid-cols-2 gap-4 mt-6">
      {displayImages.map((image, index) => (
        <div key={index} className="aspect-video">
          {image ? (
            <img
              src={image.image_url}
              alt={`Evaluation Image ${index + 1}`}
              className="w-full h-48 object-cover rounded-lg"
            />
          ) : (
            <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-400">Image placeholder {index + 1}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};