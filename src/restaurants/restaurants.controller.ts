// src/restaurants/restaurants.controller.ts
import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RestaurantsService } from './restaurants.service';

@Controller('restaurants')
@UseGuards(AuthGuard('jwt'))
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Post('save')
  async saveRestaurant(@Request() req, @Body() restaurantData: any) {
    return this.restaurantsService.saveRestaurant(req.user.sub, restaurantData);
  }

  @Get('saved')
  async getSavedRestaurants(@Request() req) {
    return this.restaurantsService.getSavedRestaurants(req.user.sub);
  }
}