import { Controller, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { formatPageParams } from 'src/utils';
import {
  FormatResponse,
  IdBodyRequestDto,
  IdResponseDto,
} from 'src/common/base.dto';
import { TemplateService } from './template.service';
import {
  CreateTemplateDto,
  QueryTemplateListDTO,
  QueryTemplateListResponseDTO,
  QueryTemplateResponseDTO,
  UpdateTemplateDto,
} from './template.dto';

@ApiTags('模板相关接口')
@Controller('template')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  @ApiOperation({ summary: '添加模板' })
  @Post('add')
  async create(
    @Body() createTemplateDto: CreateTemplateDto,
  ): Promise<IdResponseDto> {
    const { id } = await this.templateService.create(createTemplateDto);
    return { id };
  }

  @ApiOperation({ summary: '查询模板列表' })
  @Post('list')
  async findAll(
    @Body() queryParam: QueryTemplateListDTO,
  ): Promise<QueryTemplateListResponseDTO> {
    const { current, pageSize: _pageSize } = queryParam;
    const { page, pageSize } = formatPageParams(current, _pageSize);
    const { list, total } = await this.templateService.findAll({
      ...queryParam,
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
    @Body() updateTemplateDto: UpdateTemplateDto,
  ): Promise<FormatResponse> {
    await this.templateService.update(updateTemplateDto);
    return {};
  }

  @ApiOperation({ summary: '删除模板' })
  @Post('delete')
  async remove(@Body() { id }: IdBodyRequestDto): Promise<FormatResponse> {
    await this.templateService.remove(id);
    return {};
  }
}
