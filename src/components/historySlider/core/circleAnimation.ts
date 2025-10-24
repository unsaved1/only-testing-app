function calcCoord(
  type: "x" | "y",
  index: number,
  r: number,
  totalItems: number,
  offsetAngle: number
) {
  let mathOperate = Math.cos;
  if (type === "y") {
    mathOperate = Math.sin;
  }
  // the last "r" value is needed for correct positioning on the circle, because the reference point is shifted
  return r * mathOperate((2 * Math.PI * index) / totalItems + offsetAngle) + r;
}

export function animateCircle(
  currentIndex: number,
  totalItems: number,
  circleRadius: number,
  circleContainer: HTMLDivElement,
  circleElements: Array<HTMLDivElement>
) {
  const angleStep = 360 / totalItems;
  const containerRotateAngle = -angleStep * currentIndex;
  const offsetAngle = -(Math.PI / 4);

  circleContainer.style.setProperty(
    "--circle-rotate",
    `${containerRotateAngle}deg`
  );

  circleElements.forEach((item, index) => {
    const x = calcCoord("x", index, circleRadius, totalItems, offsetAngle);
    const y = calcCoord("y", index, circleRadius, totalItems, offsetAngle);
    item.style.setProperty("--circle-item-x", `${x}px`);
    item.style.setProperty("--circle-item-y", `${y}px`);
    if (index === currentIndex) {
      item.style.setProperty(
        "--circle-item-rotate",
        `${angleStep * currentIndex}deg`
      );
      item.style.removeProperty("--circle-item-rotate-index");
      return;
    }
    item.style.setProperty("--circle-item-rotate", `${angleStep * index}deg`);
    item.style.setProperty(
      "--circle-item-rotate-index",
      `${360 - angleStep * (index - currentIndex)}deg`
    );
  });
}
