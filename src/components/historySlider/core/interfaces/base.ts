import { TDivProps } from "@/shared/types";

export interface IHistorySliderItemEvent {
  year: number;
  text: string;
}

export interface IHistorySliderItem {
  id: string;
  title: string;
  events: Array<IHistorySliderItemEvent>;
}

export interface ICurrentHistorySliderItem extends IHistorySliderItem {
  index: number;
}

export interface IHistorySliderProps extends TDivProps {
  title: string;
  items: Array<IHistorySliderItem>;
  innerSliderSpeed: number;
}
