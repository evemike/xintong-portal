import { TypeOperate } from "@/ability/operate";
import { TypeSearch } from "@/ability/search";
import { InterTableColumnItem } from "@/ability/table";
//
export interface InterElsCardsProps {
  column: InterTableColumnItem[];
  search?: boolean | TypeSearch;
  operate?: TypeOperate;
  menu?: TypeOperate;
  menuLabel?: string;
  autoLoad?: boolean;
  refresh?: (
    params: Record<string, any>
  ) => Promise<{ data: any[]; total: number }>;
}
