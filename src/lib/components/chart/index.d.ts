interface CommonProps {
	width?: number;
	height?: number;
	labels?: string[];
	datasets: Dataset[];
	options?: object;
}

interface Dataset {
	label?: string;
	data: number[] | { x: number; y: number; r?: number }[];
	backgroundColor?: string[];
	borderColor?: string;
	hoverOffset?: number;
	fill?: boolean;
	tension?: number;
}
