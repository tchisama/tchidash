import OpenAI from "openai";
import { NextResponse } from "next/server";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define expected request body type
interface RequestBody {
  misspelledCity: string;
}

export async function POST(request: Request) {
  try {
    // Validate API key
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 },
      );
    }

    // Parse request body
    const body: RequestBody = await request.json();

    // Validate request body
    if (!body.misspelledCity) {
      return NextResponse.json(
        { error: "Misspelled city name is required" },
        { status: 400 },
      );
    }

    // Make OpenAI API call
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-16k",
      messages: [
        {
          role: "system",
          content: `

you will be provided with a misspelling name of a city and your work is to return a json object that have the correct city name and the region that its related to it 

example:
input:"merrakch"

output: 
{
   city:"Marrakech",
   region:"Marrakech-Tensift-El Haouz",
   "R-ID":"MA-04"
}
important :  u must return a json object

use this data for getting the result =>
[
  { "R-ID": "MA-01", "Region": "Grand Casablanca", "Cities": ["Casablanca", "Mohammedia", "Lahraouyine", "Aïn Harrouda", "Lamkansa"] },
  { "R-ID": "MA-02", "Region": "Fès-Boulemane", "Cities": ["Fes", "Sefrou", "Missour"] },
  { "R-ID": "MA-03", "Region": "Rabat-Sale-Zemmour-Zaer", "Cities": ["Salé", "Rabat", "Temara", "Khmisset", "Tifelt", "Skhirat", "Ain El Aouda"] },
  { "R-ID": "MA-04", "Region": "Marrakech-Tensift-El Haouz", "Cities": ["Marrakech", "Essaouira", "Kelaat Sraghna", "Ben Guerir", "Laataouia", "Imin tanout", "Ait Ourir"] },
  { "R-ID": "MA-05", "Region": "Tangier-Tetouan", "Cities": ["Tangier", "Tetuan", "Ksar El Kbir", "Larache", "Fnideq", "Martil", "M'dyaq", "Chefchawn", "Assilah"] },
  { "R-ID": "MA-06", "Region": "Meknes-Tafilalet", "Cities": ["Meknes", "Errachidia", "Khenifra", "Azrou", "Midelt", "M'Rirt", "Amalou Ighriben", "El Hajeb", "Arfoud", "Sabaa Aiyoun", "Errich", "Rissani", "Goulmima"] },
  { "R-ID": "MA-07", "Region": "Oriental", "Cities": ["Oujda", "Nador", "Taourirt", "Berkane", "Jrada", "Bouarfa", "Zaio", "El Arwi", "Bin Anşār", "Bouhdila", "Ahfir", "Sidi sliman echraa"] },
  { "R-ID": "MA-08", "Region": "Gharb-Chrarda-Beni Hssen", "Cities": ["Kenitra", "Sidi Sliman", "Sidi Kacem", "Ouazzane", "Souk Larbaa", "Mechra Bel Ksiri", "Jorf El Melha", "Sidi Yahya El Gharb", "Sidi Taibi", "Mehdya"] },
  { "R-ID": "MA-09", "Region": "Souss-Massa-Draa", "Cities": ["Agadir", "Inzegan", "Ait Melloul", "Taroudant", "Oulad Teima", "Tiznit", "Tinghir", "Zagora", "Aourir", "Tabounte", "Sidi Ifni", "Drargua"] },
  { "R-ID": "MA-10", "Region": "Doukkala-Abda", "Cities": ["Safi", "Jdida", "Youssoufia", "Sidi Bennour", "Azemour", "Echemaia"] },
  { "R-ID": "MA-11", "Region": "Laayoune-Boujdour-Sakia El Hamra", "Cities": ["Laayoune", "Boujdor"] },
  { "R-ID": "MA-12", "Region": "Chaouia-Ouardigha", "Cities": ["Khouribga", "Settat", "Berrechid", "Wad Zam", "Bejaad", "Ben Ahmed", "El Gara", "Bouznika", "El Borouj"] },
  { "R-ID": "MA-13", "Region": "Tadla-Azilal", "Cities": ["Beni Mellal", "Fkih BenSaleh", "Suq Sebt Oulad Nama", "Kasbat Tadla", "Azilal", "Demnate", "Zawiyat cheikh", "El Ksiba", "Oulad Ayad"] },
  { "R-ID": "MA-14", "Region": "Taza-Al Hoceima-Taounate", "Cities": ["Taza", "Hoceima", "Taounate", "Guercif", "Imzouren", "Tahla", "Karia Ba Mohamed"] },
  { "R-ID": "MA-15", "Region": "Guelmim-Es Semara", "Cities": ["Guelmim", "Tan-Tan", "Smara"] },
  { "R-ID": "MA-16", "Region": "Oued Ed-Dahab-Lagouira", "Cities": ["Dakhla"] }
]




`,
        },
        {
          role: "user",
          content: body.misspelledCity,
        },
      ],
      temperature: 0.77,
      max_tokens: 340,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    // Extract the correction from the response
    const correction = response.choices[0]?.message?.content || "";

    // Return successful response
    return NextResponse.json({ correction }, { status: 200 });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
