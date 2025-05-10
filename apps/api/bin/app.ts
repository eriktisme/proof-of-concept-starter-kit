#!/usr/bin/env node
import 'source-map-support/register'
import { App } from 'aws-cdk-lib'
import { ApiService } from '../lib'
import { projectName } from '@internal/cdk-utils'

const app = new App({
  analyticsReporting: false,
})

const stage = app.node.tryGetContext('stage') ?? 'prod'

new ApiService(app, `${stage}-${projectName}-service-api`, {
  clerk: {
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY as string,
    secretKey: process.env.CLERK_SECRET_KEY as string,
  },
  databaseUrl: process.env.DATABASE_URL as string,
  domainName: process.env.DOMAIN_NAME as string,
  projectName,
  stage,
})
