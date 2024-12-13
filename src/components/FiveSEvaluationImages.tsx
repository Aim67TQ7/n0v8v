interface FiveSEvaluationImagesProps {
  images?: { image_url: string }[];
}

export const FiveSEvaluationImages = ({ images = [] }: FiveSEvaluationImagesProps) => {
  // Create an array of 4 elements, filled with actual images or undefined
  const displayImages = Array(4).fill(undefined).map((_, index) => images[index] || undefined);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
      {displayImages.map((image, index) => (
        <div key={index} className="relative group">
          <div className="aspect-w-4 aspect-h-3 w-full">
            {image ? (
              <img
                src={image.image_url}
                alt={`Evaluation Image ${index + 1}`}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-400">Image {index + 1}</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};