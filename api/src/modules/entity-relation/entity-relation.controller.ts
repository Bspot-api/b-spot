import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiQuery } from '@nestjs/swagger';
import { EntityRelation, EntityType, RelationType } from './entity-relation.entity';
import { EntityRelationService } from './entity-relation.service';

@ApiTags('entity-relations')
@Controller('entity-relations')
export class EntityRelationController {
  constructor(private readonly entityRelationService: EntityRelationService) {}

  @Get()
  @ApiOperation({ summary: 'Get all entity relations' })
  @ApiResponse({ status: 200, description: 'Success', type: [EntityRelation] })
  async findAll(): Promise<EntityRelation[]> {
    return this.entityRelationService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get entity relation by ID' })
  @ApiResponse({ status: 200, description: 'Success', type: EntityRelation })
  @ApiResponse({ status: 404, description: 'Entity relation not found' })
  async findOne(@Param('id') id: string): Promise<EntityRelation | null> {
    return this.entityRelationService.findOne(id);
  }

  @Get('source/:sourceType/:sourceId')
  @ApiOperation({ summary: 'Get relations by source entity' })
  @ApiResponse({ status: 200, description: 'Success', type: [EntityRelation] })
  async findBySource(
    @Param('sourceType') sourceType: EntityType,
    @Param('sourceId') sourceId: string,
  ): Promise<EntityRelation[]> {
    return this.entityRelationService.findBySource(sourceType, sourceId);
  }

  @Get('target/:targetType/:targetId')
  @ApiOperation({ summary: 'Get relations by target entity' })
  @ApiResponse({ status: 200, description: 'Success', type: [EntityRelation] })
  async findByTarget(
    @Param('targetType') targetType: EntityType,
    @Param('targetId') targetId: string,
  ): Promise<EntityRelation[]> {
    return this.entityRelationService.findByTarget(targetType, targetId);
  }

  @Get('type/:relationType')
  @ApiOperation({ summary: 'Get relations by relation type' })
  @ApiResponse({ status: 200, description: 'Success', type: [EntityRelation] })
  async findByRelationType(
    @Param('relationType') relationType: RelationType,
  ): Promise<EntityRelation[]> {
    return this.entityRelationService.findByRelationType(relationType);
  }

  @Get('pair')
  @ApiOperation({ summary: 'Get relations between two specific entities' })
  @ApiQuery({ name: 'sourceType', enum: EntityType })
  @ApiQuery({ name: 'sourceId', type: String })
  @ApiQuery({ name: 'targetType', enum: EntityType })
  @ApiQuery({ name: 'targetId', type: String })
  @ApiResponse({ status: 200, description: 'Success', type: [EntityRelation] })
  async findByEntityPair(
    @Query('sourceType') sourceType: EntityType,
    @Query('sourceId') sourceId: string,
    @Query('targetType') targetType: EntityType,
    @Query('targetId') targetId: string,
  ): Promise<EntityRelation[]> {
    return this.entityRelationService.findByEntityPair(
      sourceType,
      sourceId,
      targetType,
      targetId,
    );
  }
}