export interface MediaFile {
    mimetype: string;
    url: string;
    signature?: string;
    dsa?: string;
}

export interface Image {
    url: string;
    size_type: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'custom';
    width: string;
    height: string;
}

export interface DescriptorAdditionalDesc {
    url: string;
    content_type: 'text/plain' | 'text/html' | 'application/json';
}

export interface Attribute {
    name: string;
    code?: string;
    display: boolean;
    value: unknown;
}

export interface GoogleVisionProductSearchSingleResult {
    product_labels: Array<{ key: string; value: string }>;
    name: string;
    display_name: string;
    description: string;
    score: number;
    image: string;
    is_item_group: boolean;
    item_group_id: string | null;
    is_item_in_catalog: boolean;
    item_id: string | null;
}
export interface VisionProductSearchSingleProductResults {
    bounding_poly: Array<{ x: number; y: number }>;
    results: GoogleVisionProductSearchSingleResult[];
}
export interface VisionProductSearchResponse {
    image: string;
    products: VisionProductSearchSingleProductResults[];
}
