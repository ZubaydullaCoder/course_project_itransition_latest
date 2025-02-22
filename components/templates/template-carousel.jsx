'use client';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y } from 'swiper/modules';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export function TemplateCarousel({ templates }) {
  return (
    <Swiper
      modules={[Navigation, Pagination, A11y]}
      spaceBetween={30}
      slidesPerView={1}
      navigation
      pagination={{ clickable: true }}
      breakpoints={{
        640: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 3,
        },
      }}
      className="w-full"
    >
      {templates.map((template) => (
        <SwiperSlide key={template.id}>
          <Card className="h-full">
            <CardHeader>
              <Link
                href={`/templates/${template.id}`}
                className="text-lg font-semibold hover:underline"
              >
                {template.title}
              </Link>
              <p className="text-sm text-muted-foreground">
                by {template.author.name}
              </p>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {template.description || 'No description'}
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                <Badge variant="secondary">{template.topic}</Badge>
                {template.isPublic && <Badge>Public</Badge>}
                {template._count?.responses > 0 && (
                  <Badge variant="outline">
                    {template._count.responses} responses
                  </Badge>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Link
                href={`/templates/${template.id}`}
                className="text-sm text-primary hover:underline"
              >
                View template →
              </Link>
            </CardFooter>
          </Card>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
