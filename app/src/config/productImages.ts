import rawblendsDogFood from "../images/rawblendsDogFood.jpeg";
import dParrotFood from "../images/3dParrotFood.jpeg";
import hillsCatFood from "../images/hillsCatFood.jpeg";
import maximeDogFood from "../images/maximeDogFood.jpeg";
import noissueDogTreats from "../images/noissueDogTreats.jpeg";
import parakreetDogFood from "../images/parakreetDogFood.webp";
import shebaCatFood from "../images/shebaCatFood.jpeg";
import yumyumDogFood from "../images/yumyumDogFood.jpeg";
import defaultProductImage from "../images/petdiet.png";

// Bundled photos for the catalog's products, matched by product name
const productImages: Record<string, string> = {
  "RawBlends Dog Food": rawblendsDogFood,
  "Hills Cat Food": hillsCatFood,
  "3D Parrot Food": dParrotFood,
  "Maxime Dog Food": maximeDogFood,
  "NoIssue Pet Food": noissueDogTreats,
  "Parakreet Dog Food": parakreetDogFood,
  "Sheba Cat Food": shebaCatFood,
  "Yum Yum Dog Food": yumyumDogFood,
};

// The product's own image URL if it has one, else its bundled photo, else a generic image
export const getProductImage = (product: { name: string; image?: string }): string =>
  product.image || productImages[product.name] || defaultProductImage;
