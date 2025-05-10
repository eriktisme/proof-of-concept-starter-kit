#!/usr/bin/env node
import 'source-map-support/register'
import { App } from 'aws-cdk-lib'
import { Network } from '../src'
import { projectName } from '@internal/cdk-utils'

const app = new App({
  analyticsReporting: false,
})

const stage = app.node.tryGetContext('stage') ?? 'prod'

new Network(app, `${stage}-${projectName}-network`, {
  domainName: process.env.DOMAIN_NAME as string,
  projectName,
  stage,
  tags: {
    stage,
  },
})
