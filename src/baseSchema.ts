import { z } from 'zod'

export const appidSchema = z.string().describe('Steam application ID')

export const termSchema = z.string().describe('Search term for the Steam application')

export const languageSchema = z.enum([
  'all', 'arabic', 'bulgarian', 'schinese', 'tchinese', 'czech', 'danish',
  'dutch', 'english', 'finnish', 'french', 'german', 'greek', 'hungarian',
  'indonesian', 'italian', 'japanese', 'koreana', 'norwegian', 'polish',
  'portuguese', 'brazilian', 'romanian', 'russian', 'spanish', 'latam',
  'swedish', 'thai', 'turkish', 'ukrainian', 'vietnamese',
]).optional().describe('Language filter (e.g. english, french, schinese). Default is all languages.')
