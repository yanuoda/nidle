import { Controller, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { formatPageParams } from 'src/utils';
import { AffectedResponseDto, IdBodyRequestDto } from 'src/common/base.dto';
import { TemplateService } from './template.service';
import {
  CreateTemplateDto,
  CreateTemplateResponseDto,
  QueryTemplateListDTO,
  QueryTemplateListResponseDTO,
  QueryTemplateResponseDTO,
  UpdateTemplateDto,
  UpdateTemplateResponseDto,
} from './template.dto';

@ApiTags('模板相关接口')
@Controller('template')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  @ApiOperation({ summary: '添加模板' })
  @Post('add')
  async create(
    @Body() { name, description, config }: CreateTemplateDto,
  ): Promise<CreateTemplateResponseDto> {
    const { id } = await this.templateService.create({
      name,
      description,
      config,
    });
    return { id, name };
  }

  @ApiOperation({ summary: '查询模板列表' })
  @Post('list')
  async findAllByPage(
    @Body()
    { current, pageSize: _pageSize, name, description }: QueryTemplateListDTO,
  ): Promise<QueryTemplateListResponseDTO> {
    const { page, pageSize } = formatPageParams(current, _pageSize);
    const { list, total } = await this.templateService.findAllByPage({
      name,
      description,
      current: page,
      pageSize,
    });
    return { data: list, total };
  }

  @ApiOperation({ summary: '查询模板' })
  @Post()
  async findOne(
    @Body() { id }: IdBodyRequestDto,
  ): Promise<QueryTemplateResponseDTO> {
    const data = await this.templateService.findOneBy({ id });
    return { data };
  }

  @ApiOperation({ summary: '编辑模板' })
  @Post('modify')
  async update(
    @Body() { id: _id, name, description, config }: UpdateTemplateDto,
  ): Promise<UpdateTemplateResponseDto> {
    const { id } = await this.templateService.update({
      id: _id,
      name,
      description,
      config,
    });
    return { id, name };
  }

  @ApiOperation({ summary: '删除模板' })
  @Post('delete')
  async remove(@Body() { id }: IdBodyRequestDto): Promise<AffectedResponseDto> {
    const { affected } = await this.templateService.remove(id);
    return { affected };
  }
}
