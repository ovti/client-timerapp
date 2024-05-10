import { useNavigate } from "react-router-dom";

const Info = () => {
  const navigateTo = useNavigate();

  return (
    <div className="m-2 rounded border border-fire-brick md:mx-auto md:w-10/12 lg:mx-auto lg:mt-8 lg:w-5/12">
      <div className="rounded-lg">
        <div className=" h-16 bg-red-500 p-4 ">
          <button
            onClick={() => navigateTo("/")}
            className="float-right rounded bg-fire-brick p-2 font-bold  hover:bg-red-600 hover:text-white"
            style={{ width: "2.5rem", height: "2.5rem" }}
          >
            x
          </button>
        </div>
        <div className="p-4 text-center text-2xl font-semibold">
          Autorem niniejszego serwisu jest Miłosz Załubski-Gabis. Serwis ten
          stanowi integralną część pracy licencjackiej (kierunek: elektroniczne
          przetwarzanie informacji), przygotowanej pod kierunkiem dr. hab.
          Janusza Jurka, prof. UJ na Wydziale Zarządzania i Komunikacji
          Społecznej Uniwersytetu Jagiellońskiego.
        </div>
      </div>
    </div>
  );
};

export default Info;
