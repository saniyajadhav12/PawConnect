import defaultPetImage from "../images/dummy.jpeg";

type Pet = {
    _id: string;
    type: string;
    breed: string;
    age: number;
    imageUrl?: string; // Optional
};

type PetCardProps = {
    pet: Pet;
    onAdopt: (pet: Pet) => void;
};

const PetCard: React.FC<PetCardProps> = ({ pet, onAdopt }) => {
    // Pets have no name field, so title them by breed and type
    const title = `${pet.breed} (${pet.type})`;

    return (
        <div className="pet-card">
            <img src={pet.imageUrl || defaultPetImage} alt={title} className="pet-image" />
            <div className="pet-info">
                <h2 className="pet-name">{title}</h2>
                <p className="pet-details">
                    Type: {pet.type}
                    <br />
                    Breed: {pet.breed}
                    <br />
                    Age: {pet.age} years
                </p>
                <button onClick={() => onAdopt(pet)} className="adopt-button">
                    Adopt
                </button>
            </div>
        </div>
    );
};

export default PetCard;
