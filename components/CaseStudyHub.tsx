"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";

import { ClientLogoCaseStudy } from "@/components/ClientLogoCaseStudy";
import type { CaseStudy, CaseStudyCategory, CaseStudyServiceFilter } from "@/lib/case-studies";

type CaseStudyHubProps = {
  cases: CaseStudy[];
  categories: readonly CaseStudyCategory[];
  services: readonly CaseStudyServiceFilter[];
};

const allCategory = "Todos";
const allService = "Todos los servicios";

export function CaseStudyHub({ cases, categories, services }: CaseStudyHubProps) {
  const [category, setCategory] = useState<string>(allCategory);
  const [service, setService] = useState<string>(allService);

  const filteredCases = useMemo(
    () =>
      cases.filter((caseStudy) => {
        const categoryMatch = category === allCategory || caseStudy.client.categories.includes(category as CaseStudyCategory);
        const serviceMatch = service === allService || caseStudy.serviceFilter === service;

        return categoryMatch && serviceMatch;
      }),
    [cases, category, service],
  );

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
            <SlidersHorizontal className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-700">Filtros SEO</p>
            <p className="text-sm font-semibold text-slate-600">{filteredCases.length} casos visibles</p>
          </div>
        </div>

        <div className="mt-5 space-y-5">
          <div>
            <p className="text-sm font-extrabold text-slate-950">Tipo de cliente</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {[allCategory, ...categories].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  className={`rounded-full border px-4 py-2 text-sm font-bold transition ${
                    category === item
                      ? "border-[#08385f] bg-[#08385f] text-white"
                      : "border-slate-200 bg-slate-50 text-slate-700 hover:border-sky-300 hover:bg-white"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-extrabold text-slate-950">Servicio</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {[allService, ...services].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setService(item)}
                  className={`rounded-full border px-4 py-2 text-sm font-bold transition ${
                    service === item
                      ? "border-emerald-600 bg-emerald-500 text-white"
                      : "border-slate-200 bg-slate-50 text-slate-700 hover:border-emerald-300 hover:bg-white"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filteredCases.map((caseStudy) => (
          <article
            key={caseStudy.slug}
            className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-md transition duration-300 hover:-translate-y-1 hover:border-sky-300 hover:shadow-xl"
          >
            <div className="relative aspect-[16/9] overflow-hidden bg-sky-50">
              <Image
                src={caseStudy.featuredImage}
                alt={caseStudy.h1}
                fill
                sizes="(min-width: 1280px) 30vw, (min-width: 768px) 50vw, 100vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-950/55 to-transparent" />
            </div>

            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-700">{caseStudy.serviceType}</p>
                  <h2 className="mt-3 text-xl font-extrabold leading-7 text-slate-950">{caseStudy.title}</h2>
                </div>
                <ClientLogoCaseStudy logo={caseStudy.client.logo} compact />
              </div>

              <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold text-slate-600">
                <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5">
                  <MapPin className="h-3.5 w-3.5 text-sky-700" />
                  {caseStudy.city}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5">
                  <CalendarDays className="h-3.5 w-3.5 text-sky-700" />
                  {caseStudy.serviceDateLabel}
                </span>
              </div>

              <p className="mt-4 text-sm leading-7 text-slate-700">{caseStudy.summary}</p>

              <div className="mt-5 flex flex-wrap gap-2">
                {caseStudy.client.categories.map((item) => (
                  <span key={item} className="rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-sky-800">
                    {item}
                  </span>
                ))}
              </div>

              <Link
                href={`/casos-de-exito/${caseStudy.slug}`}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#08385f] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-sky-950/15 transition hover:-translate-y-1 hover:bg-[#0e5f86]"
              >
                Ver Caso
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
