import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "nestjs-swagger-dto";

export class ProjectResponseBaseDto {
  @IsString({
    description: "프로젝트 아이디",
  })
  id: string;

  @IsString({
    description: "프로젝트 키",
  })
  key: string;

  @IsString({
    description: "프로젝트 이름",
  })
  name: string;

  @IsString({
    description: "프로젝트 설명",
  })
  description: string;
}

export class TeamResponseBaseDto {
  @IsString({
    description: "팀 아이디",
  })
  id: string;

  @IsString({
    description: "팀 키",
  })
  key: string;

  @IsString({
    description: "팀 이름",
  })
  name: string;
}

export class AwardResponseBaseDto {
  @IsString({
    description: "상 아이디",
  })
  id: string;

  @IsString({
    description: "상 키",
  })
  key: string;

  @IsString({
    description: "상 이름",
  })
  name: string;

  @IsString({
    description: "상 등급",
  })
  period: string;

  @IsString({
    description: "상 수여자",
  })
  by: string;
}

export class ProjectResponseDto extends ProjectResponseBaseDto {
  @ApiProperty({
    type: [TeamResponseBaseDto],
    description: "프로젝트에 속한 팀 목록",
  })
  teams: TeamResponseBaseDto[];

  @ApiProperty({
    type: [AwardResponseBaseDto],
    description: "프로젝트에 속한 상 목록",
  })
  awards: AwardResponseBaseDto[];
}

export class TeamResponseDto extends TeamResponseBaseDto {
  @ApiProperty({
    type: [ProjectResponseBaseDto],
    description: "팀에 속한 프로젝트 목록",
  })
  projects: ProjectResponseBaseDto[];

  @ApiProperty({
    type: [AwardResponseBaseDto],
    description: "팀에 속한 상 목록",
  })
  awards: AwardResponseBaseDto[];
}

export class AwardResponseDto extends AwardResponseBaseDto {
  @ApiProperty({
    type: [ProjectResponseBaseDto],
    description: "상에 속한 프로젝트 목록",
  })
  projects: ProjectResponseBaseDto[];

  @ApiProperty({
    type: [TeamResponseBaseDto],
    description: "상에 속한 팀 목록",
  })
  teams: TeamResponseBaseDto[];
}

export class ClientResponseDto {
  @ApiProperty({
    type: [ProjectResponseDto],
    description: "프로젝트 목록",
  })
  projects: ProjectResponseDto[];

  @ApiProperty({
    type: [TeamResponseDto],
    description: "팀 목록",
  })
  teams: TeamResponseDto[];

  @ApiProperty({
    type: [AwardResponseDto],
    description: "상 목록",
  })
  awards: AwardResponseDto[];
}
