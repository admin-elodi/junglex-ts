import { motion as Motion } from 'framer-motion';

import lion from '@assets/images/spirit-animals/lion.webp';
import elephant from '@assets/images/spirit-animals/elephant.webp';
import cheetah from '@assets/images/spirit-animals/cheetah.webp';
import giraffe from '@assets/images/spirit-animals/giraffe.webp';
import rhino from '@assets/images/spirit-animals/rhino.webp';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (animal: string) => void;
  selectedAnimal: string;
};

const animals = [
  { name: 'Lion', image: lion, meaning: 'Leadership & Courage' },
  { name: 'Elephant', image: elephant, meaning: 'Wisdom & Strength' },
  { name: 'Cheetah', image: cheetah, meaning: 'Speed & Precision' },
  { name: 'Giraffe', image: giraffe, meaning: 'Vision & Grace' },
  { name: 'Rhino', image: rhino, meaning: 'Power & Resilience' },
];

const SpiritAnimalModal = ({
  isOpen,
  onClose,
  onSelect,
  selectedAnimal,
}: Props) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50">

      <Motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-black border border-emerald-500 rounded-2xl p-6 w-[90%] max-w-lg"
      >
        <h2 className="text-center text-emerald-300 text-xl mb-4">
          Choose Your Spirit Animal
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">

          {animals.map((animal) => {
            const isSelected = selectedAnimal === animal.name;

            return (
              <Motion.div
                key={animal.name}
                onClick={() => onSelect(animal.name)}
                whileHover={{ scale: 1.05 }}
                className={`cursor-pointer rounded-xl overflow-hidden border
                  ${
                    isSelected
                      ? 'border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.6)]'
                      : 'border-gray-600'
                  }`}
              >
                <div
                  className="h-24 bg-cover bg-center"
                  style={{ backgroundImage: `url(${animal.image})` }}
                />

                <div className="p-2 text-center bg-black/70">
                  <p className="text-xs text-white font-bold">
                    {animal.name}
                  </p>
                  <p className="text-[10px] text-emerald-300">
                    {animal.meaning}
                  </p>
                </div>
              </Motion.div>
            );
          })}

        </div>

        <div className="mt-4 flex justify-between">
          <button
            onClick={onClose}
            className="text-sm text-gray-400"
          >
            Cancel
          </button>

          <button
            onClick={onClose}
            disabled={!selectedAnimal}
            className="bg-emerald-500 text-black px-4 py-1 text-sm font-bold disabled:opacity-50"
          >
            Confirm
          </button>
        </div>
      </Motion.div>
    </div>
  );
};

export default SpiritAnimalModal;