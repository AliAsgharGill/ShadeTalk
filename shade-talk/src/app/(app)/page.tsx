"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import messages from "@/messages.json";
import AutoPlay from "embla-carousel-autoplay";

const Home = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between px-4 py-12">
      <section className="text-center m-8 md:m-12">
        <h1 className="text-3xl md:text-5xl font-bold">
          Dive into the world of Shad-Talk
        </h1>
        <p className="mt-4 text-lg md:text-xl">
          Shad-Talk is a platform for developers to share their knowledge and
          experience with each other.
        </p>
      </section>{" "}
      <Carousel
        plugins={[AutoPlay({ delay: 2000 })]}
        className="w-full max-w-xs"
      >
        <CarouselContent>
          {messages.map((msg, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <Card>
                  <CardHeader className="flex items-center justify-center">
                    <span className="text-2xl font-semibold">
                      {msg.received}
                    </span>
                  </CardHeader>
                  <CardContent>
                    <h2 className="text-md text-center font-semibold">{msg.title}</h2>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </main>
  );
};

export default Home;
