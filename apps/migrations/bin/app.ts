#!/usr/bin/env node
import 'source-map-support/register'
import { App } from 'aws-cdk-lib'
import { MigrationsService } from '../src'
import { projectName } from '@internal/cdk-utils'

const app = new App({
  analyticsReporting: false,
})

const stage = app.node.tryGetContext('stage') ?? 'prod'

new MigrationsService(app, `${stage}-${projectName}-migrations`, {
  databaseUrl: process.env.DATABASE_URL as string,
  projectName,
  stage,
  tags: {
    stage,
  },
})
