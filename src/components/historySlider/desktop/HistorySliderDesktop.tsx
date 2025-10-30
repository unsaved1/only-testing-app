import { Nullable, TBtnProps } from "@/shared/types";

import { Swiper, SwiperClass, SwiperSlide, useSwiper } from "swiper/react";
import { useEffect, useRef, useState } from "react";
import { FreeMode } from "swiper/modules";

import { Delay } from "@/shared/lib/delay";
import { animateCircle } from "../core/circleAnimation";

import {
  Counter,
  ICurrentHistorySliderItem,
  IHistorySliderItem,
  IHistorySliderProps,
} from "../core";
import { Show } from "@/shared/ui/show";

import ChevronIcon from "@/assets/chevron.svg";

import cn from "clsx";
import "swiper/css";
import "swiper/css/free-mode";
import styles from "./HistorySliderDesktop.module.scss";

interface IHistorySliderDesktopProps extends IHistorySliderProps {}
interface ISliderNavButtonProps extends Omit<TBtnProps, "type" | "onClick"> {
  onClick: (swiper: SwiperClass) => void;
  type: "prev" | "next";
}

export const HistorySliderDesktop = ({
  items,
  title,
  innerSliderSpeed,
  className,
  ...props
}: IHistorySliderDesktopProps) => {
  const [prevItem, setPrevItem] = useState<Nullable<IHistorySliderItem>>(null);
  const [currentItem, setCurrentItem] = useState<ICurrentHistorySliderItem>({
    ...items[0],
    index: 0,
  });
  const [isShowSlider, setIsShowSlider] = useState(false);
  const circleContainerRef = useRef<HTMLDivElement>(null);
  const circlesRef = useRef<Array<HTMLDivElement>>([]);

  const initCircle = async (container: HTMLDivElement) => {
    await Delay.run(600);
    container.classList.add(styles["circle--init"]);
    setIsShowSlider(true);
  };

  useEffect(() => {
    if (!circleContainerRef.current) {
      return;
    }
    initCircle(circleContainerRef.current);
  }, []);

  useEffect(() => {
    if (!circleContainerRef.current) {
      return;
    }
    animateCircle(
      currentItem.index,
      items.length,
      circleContainerRef.current.offsetWidth / 2,
      circleContainerRef.current,
      circlesRef.current
    );
  }, [currentItem]);

  const handleChangeRootSlide = (destIndex: number) => {
    return (e: { preventDefault: () => void }) => {
      e.preventDefault();
      if (destIndex > items.length - 1) {
        return;
      }
      if (destIndex < 0 || destIndex === currentItem.index) {
        return;
      }
      setCurrentItem({ ...items[destIndex], index: destIndex });
      setPrevItem(items[currentItem.index]);
      setIsShowSlider(false);
    };
  };

  return (
    <div className={cn(styles.root, className)} {...props}>
      <div className={styles.root__wrapper}>
        <span className={styles.root__title}>{title}</span>
        <div
          ref={circleContainerRef}
          className={styles.circle}
          onTransitionEnd={(e) => {
            if (
              e.target === circleContainerRef.current &&
              e.propertyName === "transform"
            ) {
              setIsShowSlider(true);
            }
          }}
        >
          {items.map((item, index) => {
            return (
              <div
                key={item.id}
                className={cn(styles.circleItem, {
                  [styles["circleItem--active"]]: item.id === currentItem.id,
                })}
                onClick={handleChangeRootSlide(index)}
                ref={(el) => {
                  if (!el || circlesRef.current.includes(el)) {
                    return;
                  }
                  circlesRef.current.push(el);
                }}
              >
                <span className={styles.circleItem__index}>{index + 1}</span>
                <span className={styles.circleItem__title}>{item.title}</span>
              </div>
            );
          })}
        </div>
        <div className={styles.period}>
          <Counter
            key={prevItem?.id + "-from"}
            className={cn(styles.period__value, styles["period__value--from"])}
            value={currentItem.events[0].year}
            prevValue={prevItem?.events[0].year}
          />
          <Counter
            key={prevItem?.id + "-to"}
            className={cn(styles.period__value, styles["period__value--to"])}
            value={currentItem.events[currentItem.events.length - 1].year}
            prevValue={prevItem?.events[prevItem.events.length - 1].year}
          />
        </div>
        <div className={styles.navigation}>
          <span className={styles.navigation__indicator}>
            {(currentItem.index + 1).toString().padStart(2, "0")}/
            {items.length.toString().padStart(2, "0")}
          </span>
          <div className={styles.navigation__btns}>
            <button
              className={cn(
                styles.navigation__btn,
                styles["navigation__btn--prev"],
                {
                  [styles["navigation__btn--disabled"]]:
                    currentItem.index === 0,
                }
              )}
              onClick={handleChangeRootSlide(currentItem.index - 1)}
            >
              <ChevronIcon className={styles.chevron} />
            </button>
            <button
              className={cn(
                styles.navigation__btn,
                styles["navigation__btn--next"],
                {
                  [styles["navigation__btn--disabled"]]:
                    currentItem.index === items.length - 1,
                }
              )}
              onClick={handleChangeRootSlide(currentItem.index + 1)}
            >
              <ChevronIcon className={styles.chevron} />
            </button>
          </div>
        </div>
        <Show when={isShowSlider ? currentItem : prevItem || currentItem}>
          {(data) => (
            <div
              className={cn(styles.eventsSlider, {
                [styles["eventsSlider--show"]]: isShowSlider,
              })}
            >
              <Swiper
                className={styles.eventsSlider__swiper}
                modules={[FreeMode]}
                freeMode={{ enabled: true }}
                slidesPerView={3}
                spaceBetween={80}
                speed={innerSliderSpeed}
              >
                {data.events.map(({ year, text }) => (
                  <SwiperSlide key={year} className={styles.event}>
                    <span className={styles.event__title}>{year}</span>
                    <p className={styles.event__text}>{text}</p>
                  </SwiperSlide>
                ))}

                <div
                  className={cn(
                    styles.eventsSlider__navigationBtnRoot,
                    styles["eventsSlider__navigationBtnRoot--prev"]
                  )}
                >
                  <SliderNavButton
                    type="prev"
                    className={styles.eventsSlider__navigationBtn}
                    onClick={(swiper) => swiper.slidePrev()}
                  >
                    <ChevronIcon className={styles.chevron} />
                  </SliderNavButton>
                </div>
                <div
                  className={cn(
                    styles.eventsSlider__navigationBtnRoot,
                    styles["eventsSlider__navigationBtnRoot--next"]
                  )}
                >
                  <SliderNavButton
                    type="next"
                    className={styles.eventsSlider__navigationBtn}
                    onClick={(swiper) => swiper.slideNext()}
                  >
                    <ChevronIcon className={styles.chevron} />
                  </SliderNavButton>
                </div>
              </Swiper>
            </div>
          )}
        </Show>
      </div>
    </div>
  );
};

const SliderNavButton = ({
  onClick,
  children,
  type,
  ...props
}: ISliderNavButtonProps) => {
  const swiper = useSwiper();
  const [isShow, setIsShow] = useState(false);

  const handleClick = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    onClick(swiper);
  };

  function check(swiper: SwiperClass) {
    switch (type) {
      case "prev": {
        if (swiper.activeIndex > 1) {
          return true;
        }
        return false;
      }
      case "next": {
        const perView = swiper.params.slidesPerView ?? 0;
        if (
          swiper.activeIndex <
          swiper.slides.length - (perView === "auto" ? 0 : perView)
        ) {
          return true;
        }
        return false;
      }
    }
  }

  useEffect(() => {
    swiper.on("progress", () => {
      setIsShow(check(swiper));
    });
    swiper.on("slideChange", (swiper) => {
      setIsShow(check(swiper));
    });
  }, []);

  if (!isShow) {
    return null;
  }

  return (
    <button onClick={handleClick} {...props}>
      {children}
    </button>
  );
};
