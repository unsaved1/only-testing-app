import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation } from "swiper/modules";

import {
  Counter,
  ICurrentHistorySliderItem,
  IHistorySliderItem,
  IHistorySliderProps,
} from "../core";

import { Container } from "@/shared/ui/container";

import ChevronIcon from "@/assets/chevron.svg";

import cn from "clsx";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import styles from "./HistorySliderMobile.module.scss";

interface IHistorySliderMobileProps extends IHistorySliderProps {}

export const HistorySliderMobile = ({
  title,
  items,
  innerSliderSpeed,
  className,
  children,
  ...props
}: IHistorySliderMobileProps) => {
  const [prevItem, setPrevItem] = useState<IHistorySliderItem | null>(null);
  const [currentItem, setCurrentItem] = useState<ICurrentHistorySliderItem>({
    ...items[0],
    index: 0,
  });

  const handleChangeRootSlide = (destIndex: number) => {
    return (e: { preventDefault: () => void }) => {
      e.preventDefault();
      if (destIndex > items.length - 1) {
        return;
      }
      if (destIndex < 0) {
        return;
      }
      setCurrentItem({ ...items[destIndex], index: destIndex });
      setPrevItem(items[currentItem.index]);
    };
  };

  return (
    <div className={cn(styles.root, className)} {...props}>
      <Container>
        <span className={cn(styles.root__title, className)}>{title}</span>
        <div className={styles.period}>
          <Counter
            key={prevItem?.id + "-from"}
            className={cn(styles.period__value, styles["period__value--from"])}
            value={currentItem.events[0].year}
            prevValue={prevItem?.events[0].year}
          />
          &nbsp;&nbsp;
          <Counter
            key={prevItem?.id + "-to"}
            className={cn(styles.period__value, styles["period__value--to"])}
            value={currentItem.events[currentItem.events.length - 1].year}
            prevValue={prevItem?.events[prevItem.events.length - 1].year}
          />
        </div>
      </Container>
      <div key={currentItem.id} className={styles.eventsSlider}>
        <Container>
          <span className={styles.eventsSlider__title}>
            {currentItem.title}
          </span>
        </Container>
        <Swiper
          className={styles.eventsSlider__swiper}
          modules={[FreeMode, Navigation]}
          freeMode={{ enabled: true }}
          slidesPerView={"auto"}
          spaceBetween={25}
          speed={innerSliderSpeed}
        >
          {currentItem.events.map(({ year, text }) => (
            <SwiperSlide key={year} className={styles.event}>
              <span className={styles.event__title}>{year}</span>
              <p className={styles.event__text}>{text}</p>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <Container className={styles.navigation}>
        <span className={styles.navigation__indicator}>
          {currentItem.index + 1}/{items.length}
        </span>
        <div className={styles.navigation__wrapper}>
          <div className={styles.navigation__btns}>
            <button
              className={cn(
                styles.navigation__btn,
                styles["navigation__btn--prev"]
              )}
              onClick={handleChangeRootSlide(currentItem.index - 1)}
            >
              <ChevronIcon className={styles.chevron} />
            </button>
            <button
              className={cn(
                styles.navigation__btn,
                styles["navigation__btn--next"]
              )}
              onClick={handleChangeRootSlide(currentItem.index + 1)}
            >
              <ChevronIcon className={styles.chevron} />
            </button>
          </div>
          <div className={styles.pagination}>
            {items.map((_, index) => (
              <span
                key={index}
                className={cn(styles.pagination__bullet, {
                  [styles["pagination__bullet--active"]]:
                    currentItem.index === index,
                })}
                onClick={handleChangeRootSlide(index)}
              />
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
};
