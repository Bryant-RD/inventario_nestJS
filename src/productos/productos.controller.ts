import {
  Controller,
  Delete,
  Patch,
  Get,
  Post,
  Put,
  Body,
  Query,
  Param,
} from '@nestjs/common';

import { ProductosService } from './productos.service';

@Controller('productos')
export class ProductosController {
    
    

    constructor( private productosService:ProductosService ) {}

    @Get('/productos')
    getAllProducts() {
        return this.productosService.findAll();
    }
}
