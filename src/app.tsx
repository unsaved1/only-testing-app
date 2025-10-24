import styles from "./App.module.scss";
import { HistorySlider } from "./components/historySlider";
import { mockData } from "./mock";

export const App = () => {
  return (
    <div className={styles.root}>
      <HistorySlider
        className={styles.historySlider}
        title="Исторические даты"
        items={mockData}
        innerSliderSpeed={500}
      />
    </div>
  );
};
