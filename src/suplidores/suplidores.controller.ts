import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { SuplidoresService } from './suplidores.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../usuarios/roles/roles.decorator';
import { Role } from '../usuarios/roles/roles.enum';
import { CrearSuplidorDto } from './dtos/crear-suplidor.dto';
import { ActualizarSuplidorDto } from './dtos/actualizar-suplidor.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('suplidores')
export class SuplidoresController {
  constructor(private readonly suplidoresService: SuplidoresService) {}

  @Post()
  @Roles(Role.ADMIN, Role.EMPLOYEE)
  create(@Body() crearSuplidorDto: CrearSuplidorDto) {
    return this.suplidoresService.create(crearSuplidorDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.EMPLOYEE)
  findAll() {
    return this.suplidoresService.findAll();
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.EMPLOYEE)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.suplidoresService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.EMPLOYEE)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() actualizarSuplidorDto: ActualizarSuplidorDto,
  ) {
    return this.suplidoresService.update(id, actualizarSuplidorDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.EMPLOYEE)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.suplidoresService.remove(id);
  }
}

