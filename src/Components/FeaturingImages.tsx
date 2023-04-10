import Image from "./Image"

//implement corousal kind of presentation
export default function FeaturingImages({ imageIds, alt }: { imageIds?: string[], alt?: string }) {
    let singleImage = imageIds?.[0] ?? ""
    return (
        <Image imageId={singleImage} alt={alt} />
    )
}