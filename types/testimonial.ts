type TestimonialType = {
    _key?: string;
    name?: string;
    club?: string;
    text: string;
};

export type Testimonial = {
    _id: string;
    date: string;
    number: number;
    testimonials: TestimonialType[];
}

export default TestimonialType;
