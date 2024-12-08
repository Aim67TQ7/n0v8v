interface FiveSEvaluationImagesProps {
  images: { image_url: string }[];
}

export const FiveSEvaluationImages = ({ images }: FiveSEvaluationImagesProps) => {
  return (
    <div className="grid grid-cols-2 gap-4 mt-6">
      {images.map((image, index) => (
        <img
          key={index}
          src={image.image_url}
          alt={`Evaluation Image ${index + 1}`}
          className="w-full h-48 object-cover rounded-lg"
        />
      ))}
    </div>
  );
};