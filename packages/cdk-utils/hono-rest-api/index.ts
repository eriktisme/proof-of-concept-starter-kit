import { Construct } from 'constructs'
import { FunctionUrlAuthType } from 'aws-cdk-lib/aws-lambda'
import { Cors, EndpointType, LambdaRestApi } from 'aws-cdk-lib/aws-apigateway'
import type { IPublicHostedZone } from 'aws-cdk-lib/aws-route53'
import { AaaaRecord, ARecord, RecordTarget } from 'aws-cdk-lib/aws-route53'
import {
  Certificate,
  CertificateValidation,
} from 'aws-cdk-lib/aws-certificatemanager'
import { ApiGateway } from 'aws-cdk-lib/aws-route53-targets'
import type { NodeJSLambdaProps } from '../lambda'
import { NodeJSLambda } from '../lambda'
import type { StackProps } from '../stack'
import type { ClerkProps } from '../types'

export interface HonoRestApiProps
  extends Pick<StackProps, 'projectName' | 'stage'> {
  clerk: ClerkProps
  databaseUrl: string
  domainName: string
  handlerProps: NodeJSLambdaProps
  hostedZone: IPublicHostedZone
  serviceName: string
}

export class HonoRestApi extends Construct {
  handler: NodeJSLambda

  constructor(scope: Construct, id: string, props: HonoRestApiProps) {
    super(scope, id)

    this.handler = new NodeJSLambda(this, 'handler', {
      ...props.handlerProps,
      environment: {
        ...props.handlerProps.environment,
        CLERK_PUBLISHABLE_KEY: props.clerk.publishableKey,
        CLERK_SECRET_KEY: props.clerk.secretKey,
        DATABASE_URL: props.databaseUrl,
        DOMAIN_NAME: props.domainName,
        PROJECT_NAME: props.projectName,
        STAGE: props.stage,
      },
    })

    this.handler.addFunctionUrl({
      authType: FunctionUrlAuthType.NONE,
    })

    const restApi = new LambdaRestApi(this, 'api', {
      defaultCorsPreflightOptions: {
        allowCredentials: true,
        allowHeaders: [
          'Authorization',
          'Origin',
          'X-Requested-With',
          'Content-Type',
          'Accept',
        ],
        allowMethods: Cors.ALL_METHODS,
        allowOrigins: [
          `https://app.${props.domainName}`,
          'http://localhost:3000',
        ],
      },
      deployOptions: {
        tracingEnabled: true,
      },
      endpointTypes: [EndpointType.REGIONAL],
      handler: this.handler,
      restApiName: `${props.stage}-${props.projectName}-${props.serviceName}-api`,
    })

    if (props.hostedZone) {
      const domainName = `${props.serviceName}.${props.hostedZone.zoneName}`

      const certificate = new Certificate(this, 'certificate', {
        domainName,
        validation: CertificateValidation.fromDns(props.hostedZone),
      })

      restApi.addDomainName('default', {
        certificate,
        domainName,
      })

      new ARecord(this, 'api-a', {
        recordName: domainName,
        zone: props.hostedZone,
        target: RecordTarget.fromAlias(new ApiGateway(restApi)),
      })

      new AaaaRecord(this, 'api-aaaa', {
        recordName: domainName,
        zone: props.hostedZone,
        target: RecordTarget.fromAlias(new ApiGateway(restApi)),
      })
    }
  }
}
