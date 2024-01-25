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
