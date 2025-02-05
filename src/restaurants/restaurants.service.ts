// src/restaurants/restaurants.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RestaurantsService {
  constructor(private prisma: PrismaService) {}

  async saveRestaurant(userId: string, restaurantData: any) {
    return this.prisma.savedPlace.create({
      data: {
        userId,
        name: restaurantData.name,
        location: restaurantData.location,
        priceRange: restaurantData.priceRange,
        description: restaurantData.description,
        specialty: restaurantData.specialty,
        contact: restaurantData.contact,
        verified: restaurantData.verified,
      },
    });
  }

  async getSavedRestaurants(userId: string) {
    return this.prisma.savedPlace.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}