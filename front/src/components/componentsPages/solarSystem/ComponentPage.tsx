/* eslint-disable @next/next/no-img-element */
"use client"

import axios from "axios";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";
import { DataRow, SectionCard } from "@/components/ui/Section";
import { ExternalLink } from "lucide-react";

import Loading from "@/app/loading";


interface PlanetData {
  name: string;
  type: string;
  presentation: string;
  description: string;
  ui_theme: {
    primary_color: string;
    secondary_color: string;
  };
  earth_comparison: {
    size: string;
    gravity: string;
    day_length: string;
  };
  culture: {
    name_origin: string;
    astronomical_symbol: string;
  };
  curiosities: string[];
  geological_data: {
    composition: string;
    core: string;
    surface: string;
  };
  atmospheric_data: {
    summary: string;
    details: string;
    main_components: string[];
  };
  natural_satellites: {
    has_satellites: boolean;
    count: number;
    list: string[];
  };
  space_missions: Array<{
    name: string;
    agency: string;
    year: string;
    feat: string;
  }>;
  technical_data: {
    diameter_km: number;
    distance_from_sun_au: number;
    distance_from_sun_km: number;
    gravity_ms2: number;
    avg_temperature_c: number;
    orbital_period: string;
    rotation_period: string;
  };
}


export const ComponentPage = ({ planetSlug }: { planetSlug: string }) => {
  const [planet, setPlanet] = useState<PlanetData>();

  const apiOff = "http://127.0.0.1:4000"
  const apiOn = "https://api-universe.onrender.com"

  const GetPlanet = async () => {
    try {
      const response = await axios.get(`${apiOn}/api/solar-system`);

      for (let i=0; i<response.data.length; i++) {
        if (response.data[i].slug === planetSlug) {
          setPlanet(response.data[i]);
        }
      }

    } catch (error) {
      console.error("Error fetching planet data", error)
    }
  }

  useEffect(() => {
    GetPlanet();
  }, []);

  if (!planet) {
    return <Loading />;
  }

  return (
    <main className="space-y-8">
      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 
                className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text"
                style={{ backgroundImage: `linear-gradient(to right, ${planet.ui_theme.primary_color}, ${planet.ui_theme.secondary_color})`}}
              >
                {planet.name}
              </h1>
              <span className="text-4xl">{planet.culture.astronomical_symbol}</span>
            </div>
            <p className="text-lg text-slate-300">{planet.presentation}</p>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4">
            <h3 className="font-semibold text-slate-300 mb-3">Cultural & Historical</h3>
            <p className="text-sm text-slate-400">{planet.culture.name_origin}</p>
          </div>

          <div>
            <p className="text-justify text-slate-300 leading-relaxed">{planet.description}</p>
          </div>
        </div>

        <div className="relative">
          <img 
            src={`/planets/${planetSlug}.png`} 
            alt={planet.name} 
            className="w-full h-auto"
          />
        </div>
      </div>

      {/* Comparação com a Terra */}
      <SectionCard title="Earth Comparison" description="How does this planet compare to our home?">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-sm text-slate-400 mb-2">Size</p>
            <p className="font-semibold text-lg">{planet.earth_comparison.size}</p>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-sm text-slate-400 mb-2">Gravity</p>
            <p className="font-semibold text-lg">{planet.earth_comparison.gravity}</p>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-sm text-slate-400 mb-2">Day Length</p>
            <p className="font-semibold text-lg">{planet.earth_comparison.day_length}</p>
          </div>
        </div>
      </SectionCard>

      {/* Curiosidades */}
      <SectionCard title="Curiosities" description="Interesting facts about this world">
        <ul className="space-y-3">
          {planet.curiosities.map((curiosity, index) => (
            <li key={index} className="flex gap-3">
              <span className="text-purple-400 font-bold shrink-0">•</span>
              <span className="text-slate-300">{curiosity}</span>
            </li>
          ))}
        </ul>
      </SectionCard>

      {/* Dados Técnicos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Geological Data */}
        <SectionCard title="Geological Data" description="Physical composition and structure">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-slate-300 mb-2">Composition</h4>
              <p className="text-sm text-slate-400">{planet.geological_data.composition}</p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-300 mb-2">Core</h4>
              <p className="text-sm text-slate-400">{planet.geological_data.core}</p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-300 mb-2">Surface</h4>
              <p className="text-sm text-slate-400">{planet.geological_data.surface}</p>
            </div>
          </div>
        </SectionCard>

        {/* Atmospheric Data */}
        <SectionCard title="Atmospheric Data" description="Composition and characteristics">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-slate-300 mb-2">Summary</h4>
              <p className="text-sm text-slate-400">{planet.atmospheric_data.summary}</p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-300 mb-2">Details</h4>
              <p className="text-sm text-slate-400">{planet.atmospheric_data.details}</p>
            </div>
            {planet.atmospheric_data.main_components.length > 0 && (
              <div>
                <h4 className="font-semibold text-slate-300 mb-2">Main Components</h4>
                <div className="flex flex-wrap gap-2">
                  {planet.atmospheric_data.main_components.map((component, index) => (
                    <span key={index} className="px-3 py-1 bg-purple-900/50 text-purple-300 text-xs rounded-full">
                      {component}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </SectionCard>
      </div>

      {/* Dados Técnicos Detalhados */}
      <SectionCard title="Technical Data" description="Orbital and physical parameters">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <DataRow label="Diameter" value={`${planet.technical_data.diameter_km.toLocaleString()} km`} />
            <DataRow label="Distance from Sun (AU)" value={planet.technical_data.distance_from_sun_au} />
            <DataRow label="Distance from Sun (km)" value={`${planet.technical_data.distance_from_sun_km.toLocaleString()} km`} />
            <DataRow label="Surface Gravity" value={`${planet.technical_data.gravity_ms2} m/s²`} />
          </div>
          <div>
            <DataRow label="Average Temperature" value={`${planet.technical_data.avg_temperature_c}°C`} />
            <DataRow label="Orbital Period" value={planet.technical_data.orbital_period} />
            <DataRow label="Rotation Period" value={planet.technical_data.rotation_period} />
            <DataRow label="Planet Type" value={planet.type} />
          </div>
        </div>
      </SectionCard>

      {/* Satélites Naturais */}
      {planet.natural_satellites.has_satellites && (
        <SectionCard 
          title="Natural Satellites" 
          description={`${planet.natural_satellites.count} satellite(s) orbiting this planet`}
        >
          {planet.natural_satellites.list.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {planet.natural_satellites.list.map((satellite, index) => (
                <div key={index} className="bg-slate-800/50 p-3 rounded-lg text-center">
                  <p className="font-semibold text-slate-300">{satellite}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400">No major satellites listed.</p>
          )}
        </SectionCard>
      )}

      {/* Exploração Espacial */}
      <SectionCard title="Space Exploration" description="Key missions to this world">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {planet.space_missions.map((mission, index) => (
            <div key={index} className="border border-slate-700 rounded-lg p-4 hover:border-purple-700 transition-colors">
              <h4 className="font-semibold text-slate-300 mb-2">{mission.name}</h4>
              <p className="text-sm text-slate-400 mb-2">
                <span className="font-semibold">Agency:</span> {mission.agency}
              </p>
              <p className="text-sm text-slate-400 mb-2">
                <span className="font-semibold">Year:</span> {mission.year}
              </p>
              <p className="text-sm text-slate-300">{mission.feat}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Links Úteis */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-8 text-center space-y-4">
        <h3 className="text-xl font-semibold">Continue Exploring</h3>
        <p className="text-slate-400">Learn more about {planet.name} from these resources:</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button className="flex items-center gap-2 px-6">
            <a href={`https://en.wikipedia.org/wiki/${planet.name}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
              Wikipedia <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
          {/* <Button className="flex items-center gap-2 px-6" variant="outline">
            <a href="#" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
              NASA <ExternalLink className="h-4 w-4" />
            </a>
          </Button> */}
        </div>
      </div>
    </main>
  )
}
