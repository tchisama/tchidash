import { z } from "zod";
import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { NextRequest } from "next/server";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/firebase";

export async function GET(request: NextRequest) {
  const city = request.nextUrl.searchParams.get("city");
  if (!city) {
    return new Response("City is required", { status: 400 });
  }

  const alreadyExist = findCity(city);
  if (alreadyExist) {
    addToDb(alreadyExist, city);
    return new Response(JSON.stringify(alreadyExist));
  }

  const result = await generateObject({
    model: openai("gpt-3.5-turbo"),
    //model: google("gemini-1.5-pro"),
    schema: z.object({
      city: z.string(),
      region: z.string(),
      "R-ID": z.string(),
    }),
    temperature: 0.6,
    system: systemPromptWithoutCities,
    prompt: city,
  });
  console.log(result.toJsonResponse());
  addToDb(
    {
      city: result.object.city,
      region: result.object.region,
      "R-ID": result.object["R-ID"],
      method: "generated",
    },
    city,
  );
  return new Response(
    JSON.stringify({ ...result.object, method: "generated" }),
  );
}

//const systemPromptWithCities = `
//you will be provided with a misspelling name of a moroccan city and your work is to return a json object that have the correct city name based on english language
//and the region that its related to it , important make sure the moroccan region is correct
//
//if the city is already here use this data =>
//[
//  { "R-ID": "MA-01", "Region": "Grand Casablanca", "Cities": ["Casablanca", "Mohammedia", "Lahraouyine", "Aïn Harrouda", "Lamkansa"] },
//  { "R-ID": "MA-02", "Region": "Fès-Boulemane", "Cities": ["Fes", "Sefrou", "Missour"] },
//  { "R-ID": "MA-03", "Region": "Rabat-Sale-Zemmour-Zaer", "Cities": ["Salé", "Rabat", "Temara", "Khmisset", "Tifelt", "Skhirat", "Ain El Aouda"] },
//  { "R-ID": "MA-04", "Region": "Marrakech-Tensift-El Haouz", "Cities": ["Marrakech", "Essaouira", "Kelaat Sraghna", "Ben Guerir", "Laataouia", "Imin tanout", "Ait Ourir"] },
//  { "R-ID": "MA-05", "Region": "Tangier-Tetouan", "Cities": ["Tangier", "Tetuan", "Ksar El Kbir", "Larache", "Fnideq", "Martil", "M'dyaq", "Chefchawn", "Assilah"] },
//  { "R-ID": "MA-06", "Region": "Meknes-Tafilalet", "Cities": ["Meknes", "Errachidia", "Khenifra", "Azrou", "Midelt", "M'Rirt", "Amalou Ighriben", "El Hajeb", "Arfoud", "Sabaa Aiyoun", "Errich", "Rissani", "Goulmima"] },
//  { "R-ID": "MA-07", "Region": "Oriental", "Cities": ["Oujda", "Nador", "Taourirt", "Berkane", "Jrada", "Bouarfa", "Zaio", "El Arwi", "Bin Anşār", "Bouhdila", "Ahfir", "Sidi sliman echraa"] },
//  { "R-ID": "MA-08", "Region": "Gharb-Chrarda-Beni Hssen", "Cities": ["Kenitra", "Sidi Sliman", "Sidi Kacem", "Ouazzane", "Souk Larbaa", "Mechra Bel Ksiri", "Jorf El Melha", "Sidi Yahya El Gharb", "Sidi Taibi", "Mehdya"] },
//  { "R-ID": "MA-09", "Region": "Souss-Massa-Draa", "Cities": ["Agadir", "Inzegan", "Ait Melloul", "Taroudant", "Oulad Teima", "Tiznit", "Tinghir", "Zagora", "Aourir", "Tabounte", "Sidi Ifni", "Drargua" , "Ouarzazate"] },
//  { "R-ID": "MA-10", "Region": "Doukkala-Abda", "Cities": ["Safi", "Jdida", "Youssoufia", "Sidi Bennour", "Azemour", "Echemaia"] },
//  { "R-ID": "MA-11", "Region": "Laayoune-Boujdour-Sakia El Hamra", "Cities": ["Laayoune", "Boujdor"] },
//  { "R-ID": "MA-12", "Region": "Chaouia-Ouardigha", "Cities": ["Khouribga", "Settat", "Berrechid", "Wad Zam", "Bejaad", "Ben Ahmed", "El Gara", "Bouznika", "El Borouj"] },
//  { "R-ID": "MA-13", "Region": "Tadla-Azilal", "Cities": ["Beni Mellal", "Fkih BenSaleh", "Suq Sebt Oulad Nama", "Kasbat Tadla", "Azilal", "Demnate", "Zawiyat cheikh", "El Ksiba", "Oulad Ayad"] },
//  { "R-ID": "MA-14", "Region": "Taza-Al Hoceima-Taounate", "Cities": ["Taza", "Hoceima", "Taounate", "Guercif", "Imzouren", "Tahla", "Karia Ba Mohamed"] },
//  { "R-ID": "MA-15", "Region": "Guelmim-Es Semara", "Cities": ["Guelmim", "Tan-Tan", "Smara"] },
//  { "R-ID": "MA-16", "Region": "Oued Ed-Dahab-Lagouira", "Cities": ["Dakhla"] }
//]
//`;
const systemPromptWithoutCities = `
you will be provided with a misspelling name of a moroccan city and your work is to return a json object that have the correct city name based on english language
and the region that its related to it , important make sure the moroccan region is correct , the city can be arabic or french but you must return english one with capitalized first letter
if the city is already here use this data =>
ex: casa => Casablanca ; darbida => Casablanca ; الدار البيضاء => Casablanca ; 
use this for region id =>
{
   "MA-01":  "Grand Casablanca",
    "MA-02":  "Fès-Boulemane",
    "MA-03":  "Rabat-Sale-Zemmour-Zaer",
    "MA-04":  "Marrakech-Tensift-El Haouz",
    "MA-05":  "Tangier-Tetouan",
    "MA-06":  "Meknes-Tafilalet",
    "MA-07":  "Oriental",
    "MA-08":  "Gharb-Chrarda-Beni Hssen",
    "MA-09":  "Souss-Massa-Draa",
    "MA-10":  "Doukkala-Abda",
    "MA-11":  "Laayoune-Boujdour-Sakia El Hamra",
    "MA-12":  "Chaouia-Ouardigha",  
    "MA-13":  "Tadla-Azilal",
    "MA-14":  "Taza-Al Hoceima-Taounate",
    "MA-15":  "Guelmim-Es Semara",
    "MA-16":  "Oued Ed-Dahab-Lagouira"
}
`;

type City = {
  city: string;
  region: string;
  "R-ID": string;
  method: string;
  misspelled: string[];
  id: string;
};

const addToDb = async (
  data: {
    city: string;
    region: string;
    "R-ID": string;
    method: string;
  },
  city: string,
) => {
  const q = query(collection(db, "cities"), where("city", "==", data.city));
  const getCity: City[] = await getDocs(q).then((snapshot) => {
    return snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }) as City);
  });
  console.log("checking");
  if (getCity.length == 0) {
    addDoc(collection(db, "cities"), {
      city: data.city,
      region: data.region,
      "R-ID": data["R-ID"],
      method: data.method,
      misspelled: [city],
    });
    console.log("added");
  } else {
    if (getCity[0].misspelled.includes(city)) return;
    updateDoc(doc(db, "cities", getCity[0].id), {
      misspelled: [...getCity[0].misspelled, city],
    });
    console.log("updated");
  }
};

const findCity = (city: string) => {
  for (const region of citiesOnEchRegion) {
    for (const c of region.Cities) {
      if (c.toLowerCase() === city.toLowerCase()) {
        return {
          city: c,
          region: region.Region,
          "R-ID": region["R-ID"],
          method: "alreadyExist",
        };
      }
    }
  }
  return null;
};

const citiesOnEchRegion = [
  {
    "R-ID": "MA-01",
    Region: "Grand Casablanca",
    Cities: [
      "Casablanca",
      "Mohammedia",
      "Lahraouyine",
      "Aïn Harrouda",
      "Lamkansa",
      "Dar Bouazza",
      "Bouskoura",
    ],
  },
  {
    "R-ID": "MA-02",
    Region: "Fès-Boulemane",
    Cities: [
      "Fès",
      "Sefrou",
      "Missour",
      "Boulemane",
      "Imouzzer Kandar",
      "Ain Cheggag",
    ],
  },
  {
    "R-ID": "MA-03",
    Region: "Rabat-Sale-Zemmour-Zaer",
    Cities: [
      "Salé",
      "Rabat",
      "Temara",
      "Khemisset",
      "Tifelt",
      "Skhirat",
      "Ain El Aouda",
      "Bouknadel",
    ],
  },
  {
    "R-ID": "MA-04",
    Region: "Marrakech-Tensift-El Haouz",
    Cities: [
      "Marrakech",
      "Essaouira",
      "Kelaat Sraghna",
      "Ben Guerir",
      "Laataouia",
      "Imin tanout",
      "Ait Ourir",
      "Chichaoua",
      "Sidi Bou Othmane",
    ],
  },
  {
    "R-ID": "MA-05",
    Region: "Tangier-Tetouan",
    Cities: [
      "Tangier",
      "Tetouan",
      "Ksar El Kebir",
      "Larache",
      "Fnideq",
      "Martil",
      "M'diq",
      "Chefchaouen",
      "Asilah",
      "Oued Laou",
    ],
  },
  {
    "R-ID": "MA-06",
    Region: "Meknes-Tafilalet",
    Cities: [
      "Meknes",
      "Errachidia",
      "Khenifra",
      "Azrou",
      "Midelt",
      "M'Rirt",
      "Amalou Ighriben",
      "El Hajeb",
      "Arfoud",
      "Sabaa Aiyoun",
      "Rich",
      "Rissani",
      "Goulmima",
      "Aoufous",
    ],
  },
  {
    "R-ID": "MA-07",
    Region: "Oriental",
    Cities: [
      "Oujda",
      "Nador",
      "Taourirt",
      "Berkane",
      "Jerada",
      "Bouarfa",
      "Zaio",
      "El Aïoun Sidi Mellouk",
      "Beni Ensar",
      "Ahfir",
      "Sidi Slimane Ech-Chraa",
      "Aklim",
    ],
  },
  {
    "R-ID": "MA-08",
    Region: "Gharb-Chrarda-Beni Hssen",
    Cities: [
      "Kenitra",
      "Sidi Slimane",
      "Sidi Kacem",
      "Ouezzane",
      "Souk Larbaa",
      "Mechraa Bel Ksiri",
      "Jorf El Melha",
      "Sidi Yahya El Gharb",
      "Sidi Taibi",
      "Mehdya",
    ],
  },
  {
    "R-ID": "MA-09",
    Region: "Souss-Massa-Draa",
    Cities: [
      "Agadir",
      "Inezgane",
      "Ait Melloul",
      "Taroudant",
      "Oulad Teima",
      "Tiznit",
      "Tinghir",
      "Zagora",
      "Aourir",
      "Tabounte",
      "Sidi Ifni",
      "Drargua",
      "Ouarzazate",
      "Bouzakarne",
    ],
  },
  {
    "R-ID": "MA-10",
    Region: "Doukkala-Abda",
    Cities: [
      "Safi",
      "El Jadida",
      "Youssoufia",
      "Sidi Bennour",
      "Azemmour",
      "Echemmaia",
      "Zemamra",
    ],
  },
  {
    "R-ID": "MA-11",
    Region: "Laayoune-Boujdour-Sakia El Hamra",
    Cities: ["Laayoune", "Boujdour", "Tarfaya"],
  },
  {
    "R-ID": "MA-12",
    Region: "Chaouia-Ouardigha",
    Cities: [
      "Khouribga",
      "Settat",
      "Berrechid",
      "Oued Zem",
      "Bejaad",
      "Ben Ahmed",
      "El Gara",
      "Bouznika",
      "El Borouj",
    ],
  },
  {
    "R-ID": "MA-13",
    Region: "Tadla-Azilal",
    Cities: [
      "Beni Mellal",
      "Fkih Ben Salah",
      "Souk Sebt Oulad Nemma",
      "Kasba Tadla",
      "Azilal",
      "Demnate",
      "Zawyat Cheikh",
      "El Ksiba",
      "Oulad Ayad",
      "Bzou",
    ],
  },
  {
    "R-ID": "MA-14",
    Region: "Taza-Al Hoceima-Taounate",
    Cities: [
      "Taza",
      "Al Hoceima",
      "Taounate",
      "Guercif",
      "Imzouren",
      "Tahla",
      "Karia Ba Mohamed",
      "Tamassint",
      "Ajdir",
    ],
  },
  {
    "R-ID": "MA-15",
    Region: "Guelmim-Es Semara",
    Cities: ["Guelmim", "Tan-Tan", "Es-Semara", "Bouizakarne"],
  },
  {
    "R-ID": "MA-16",
    Region: "Oued Ed-Dahab-Lagouira",
    Cities: ["Dakhla", "Lagouira"],
  },
];
