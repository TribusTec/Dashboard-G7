"use client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Users,
  Target,
  Lock,
  Flame,
} from "lucide-react";
import type { Trilha } from "@/types/painel";

interface MobilePreviewProps {
  trilha: Trilha;
  isOpen: boolean;
  onClose: () => void;
}

export function MobilePreview({ trilha, isOpen, onClose }: MobilePreviewProps) {
  const etapasReversed = [...(trilha.etapas || [])].reverse();

  const usesCustomImage = (etapa: any) => {
    return (
      etapa.iconLibrary === "custom" &&
      etapa.imageUrl &&
      etapa.imageUrl.trim() !== ""
    );
  };

  const getEtapaImage = (etapa: any) => {
    if (usesCustomImage(etapa)) {
      return etapa.imageUrl || etapa.icon;
    }
    return etapa.image || null;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm p-0 gap-0 bg-transparent border-none shadow-none">
        <div className="bg-black rounded-[2.5rem] p-2 shadow-2xl">
          <div className="bg-white rounded-[2rem] overflow-hidden h-[640px] w-full relative flex flex-col">
            <div className="bg-marca/70 px-4 py-3 flex-shrink-0">
              <div className="flex justify-between items-center">
                <Badge className="bg-marca hover:bg-marca text-white text-xs px-3 py-1 rounded-full">
                  <Target className="w-3 h-3 mr-1" />0 Pontos
                </Badge>
                <Badge className="bg-marca hover:bg-marca text-white text-xs px-3 py-1 rounded-full">
                  <Users className="w-3 h-3 mr-1" />1 dias
                </Badge>
                <Badge className="bg-marca hover:bg-marca text-white text-xs px-3 py-1 rounded-full">
                  <Flame className="w-3 h-3 mr-1" />0
                </Badge>
              </div>
            </div>

            <div className="flex-1 relative overflow-hidden">
              {trilha.backgroundSvg && (
                <div
                  className="absolute inset-0  bg-cover bg-center bg-no-repeat"
                  style={{
                    backgroundImage: `url(${trilha.backgroundSvg})`,
                    filter: "blur(1px)",
                  }}
                />
              )}

              <div className="relative z-10 h-full overflow-y-auto">
                <div className="h-full flex flex-col justify-between py-6 px-8">
                  {etapasReversed.map((etapa, index) => {
                    const isFirstEtapa = index === etapasReversed.length - 1;
                    const etapaNumber = etapasReversed.length - index;
                    const etapaImage = getEtapaImage(etapa);

                    return (
                      <div
                        key={etapa.id}
                        className="relative flex-1 flex items-center justify-center"
                      >
                        <div className="relative flex flex-col items-center mb-8">
                          <div className="relative">
                            {!isFirstEtapa && (
                              <div className="absolute -top-3 left-1/3 bg-marca shadow-lg border-2  text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold z-20">
                                {etapaNumber}
                              </div>
                            )}

                            <div
                              className={`w-16 h-16 rounded-full flex items-center justify-center border-4 overflow-hidden ${
                                isFirstEtapa
                                  ? "bg-white border-orange-500"
                                  : "bg-gray-600 border-gray-500"
                              }`}
                            >
                              {isFirstEtapa ? (
                                etapaImage ? (
                                  <img
                                    src={etapaImage}
                                    className="w-full h-full object-cover rounded-full"
                                    onError={(e) => {
                                      e.currentTarget.style.display = "none";
                                      e.currentTarget.nextElementSibling?.classList.remove(
                                        "hidden"
                                      );
                                    }}
                                  />
                                ) : (
                                  <User className="w-6 h-6 text-gray-700" />
                                )
                              ) : (
                                <Lock className="w-6 h-6 text-white" />
                              )}

                              {isFirstEtapa && etapaImage && (
                                <User className="w-6 h-6 text-gray-700 hidden" />
                              )}
                            </div>
                          </div>

                          <div className="mt-4 text-center max-w-36 ">
                            <h3 className="text-white bg-marca p-2  rounded-md text-xs font-semibold drop-shadow-lg leading-tight">
                              {etapa.titulo}
                            </h3>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="bg-marca/70 text-white p-4 flex-shrink-0">
              <div className="flex justify-between items-center mb-3">
                <div className="text-center flex-1">
                  <p className="text-white font-medium text-base">
                    {trilha.nome}
                  </p>
                  {/*  <div className="flex gap-1 mt-2 justify-center">
                    {trilha.etapas?.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full ${
                          index === 0 ? "bg-white" : "bg-white/40"
                        }`}
                      />
                    ))}
                  </div> */}
                </div>
              </div>
            </div>

            {/* Bottom Tab Navigation */}
            <div className="bg-cyan-800 text-white p-3 flex-shrink-0">
              <div className="flex justify-around">
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 bg-cyan-950 rounded flex items-center justify-center">
                    <Target className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div className="flex flex-col items-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Info */}
        <div className="text-center mt-4 text-white">
          <p className="text-sm">
            <span className="font-semibold">{trilha.etapas?.length || 0}</span>{" "}
            etapas
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
