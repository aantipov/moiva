import {
  Chart,
  ChartComponentLike,
  // ArcElement,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  // BubbleController,
  // DoughnutController,
  LineController,
  // PieController,
  // PolarAreaController,
  // RadarController,
  // ScatterController,
  CategoryScale,
  LinearScale,
  // LogarithmicScale,
  // RadialLinearScale,
  TimeScale,
  // TimeSeriesScale,
  // Decimation,
  Filler,
  Legend,
  Title,
  Tooltip,
  // registerables,
} from 'chart.js';
import 'chartjs-adapter-date-fns';

Chart.register(
  LineElement,
  BarElement,
  PointElement,
  BarController,
  LineController,
  CategoryScale,
  LinearScale,
  TimeScale,
  Filler,
  Legend,
  Title,
  Tooltip,
  {
    id: 'custom_canvas_background_color',
    // @ts-ignore
    beforeDraw: (chart) => {
      const ctx = chart.canvas.getContext('2d') as CanvasRenderingContext2D;
      ctx.save();
      ctx.globalCompositeOperation = 'destination-over';
      ctx.fillStyle = 'rgba(243, 244, 246)'; // bg-gray-100
      ctx.fillRect(0, 0, chart.width, chart.height);
      ctx.restore();
    },
  } as ChartComponentLike
);

Chart.defaults.layout.padding = 24;
// @ts-ignore
Chart.defaults.font.size = 14;
// @ts-ignore
Chart.defaults.font.family =
  'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';
Chart.defaults.plugins.title.padding = 0;
Chart.defaults.plugins.title.font = {
  ...Chart.defaults.plugins.title.font,
  size: 16,
  family:
    'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
};

Chart.defaults.plugins.legend.labels.boxWidth = 20;
Chart.defaults.maintainAspectRatio = false;
// @ts-ignore
Chart.defaults.elements.line.borderWidth = 4;
// @ts-ignore
Chart.defaults.elements.line.fill = false;
// @ts-ignore
Chart.defaults.elements.line.tension = 0;

// @ts-ignore
Chart.defaults.elements.point.radius = 4;
// @ts-ignore
Chart.defaults.elements.point.hoverRadius = 6;

Chart.defaults.plugins.tooltip.mode = 'index';
Chart.defaults.plugins.tooltip.bodySpacing = 6;
Chart.defaults.plugins.tooltip.position = 'nearest';
Chart.defaults.plugins.tooltip.intersect = false;
Chart.defaults.plugins.tooltip.callbacks.label = (context): string => {
  const label = context.dataset.label;
  return ` ${label}: ${Number(context.parsed.y).toLocaleString()}`;
};
