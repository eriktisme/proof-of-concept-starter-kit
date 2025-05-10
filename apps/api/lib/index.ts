import type { StackProps } from '@internal/cdk-utils/stack'
import { Stack } from '@internal/cdk-utils/stack'
import type { Construct } from 'constructs'
import type { ClerkProps } from '@internal/cdk-utils/types'
import { HonoRestApi } from '@internal/cdk-utils/hono-rest-api'
import { StringParameter } from 'aws-cdk-lib/aws-ssm'
import { PublicHostedZone } from 'aws-cdk-lib/aws-route53'

interface Props extends StackProps {
  clerk: ClerkProps
  databaseUrl: string
  domainName: string
}

export class ApiService extends Stack {
  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id, props)

    const hostedZoneId = StringParameter.fromStringParameterName(
      this,
      'hosted-zone-id',
      `/${props.stage}/${props.projectName}/hosted-zone-id`
    ).stringValue

    const hostedZone = PublicHostedZone.fromPublicHostedZoneAttributes(
      this,
      'hosted-zone',
      {
        zoneName: props.domainName,
        hostedZoneId,
      }
    )

    const { handler } = new HonoRestApi(this, 'api', {
      clerk: props.clerk,
      handlerProps: {
        entry: './src/index.ts',
      },
      hostedZone,
      domainName: props.domainName,
      databaseUrl: props.databaseUrl,
      projectName: props.projectName,
      serviceName: 'api',
      stage: props.stage,
    })
  }
}
