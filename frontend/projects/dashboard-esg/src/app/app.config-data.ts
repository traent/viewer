/* eslint-disable max-len */
import { IndicatorDefinition } from './app.model';

export const REPORT_YEAR = 2022;

export const CHART_RENEWABLE_MAX = 100;
export const CHART_CO2_EMISSIONS_MAX = undefined;
export const CHART_FEMALE_EMPLOYEES_MAX = 100;
export const CHART_SOCIAL_COMMITMENT_MAX = undefined;
export const CHART_ETHICS_BREACH_MAX = 1;
export const CHART_INDEPENDENT_DIRECTORS_MAX = 100;

export const DOC_ESG_PLEDGE_NAME = 'ESG Pledge'; //
export const DOC_ESG_REPORT_NAME = 'ESG Report'; //
export const DOC_PITCH_BOOK_NAME = 'Pitchbook'; //
export const DOC_CAMPAIGN_TAG = 'Campaign'; //
export const DOC_COMMUNICATION_TAG = 'Communication'; //
export const DOC_PRODUCT_PRESENTATION_TAG = 'Product presentation'; //

export const STREAM_INDUSTRY_NAME = 'Category'; // _select_ Green Tech, Sustainable lifestyle, Sustainable business, Sustainable living, Sustainable mobility, Sustainable finance
export const STREAM_COMPANY_DESCRIPTION_NAME = 'Company claim'; // Company description (max 256 characters)
export const STREAM_NUMBER_OF_EMPLOYEES_NAME = 'Total employees'; //
export const STREAM_ALLIANCE_ROLE_NAME = 'Alliance Role';
export const STREAM_REVENUE_NAME = 'Company revenue'; //
export const STREAM_VALUATION_NAME = 'Company valuation'; //
export const STREAM_FUNDING_NAME = 'Funding amount'; //
export const STREAM_LOOKING_FOR_FINANCING_NAME = 'Is looking for financing';
export const STREAM_PROVIDED_BY_NAME = 'Data Provided by'; //

export const STREAM_INDICATOR_RENEWABLE_ENERGY_NAME = 'Renewable Energy 2022'; // % of total energy use from renewables
export const STREAM_INDICATOR_SCOPE_EMISSIONS_NAME = 'Greenhouse Gas (GHG) Emissions 2022'; // Mtons of CO2e p.a. (Co2 calculation from third party consultancy)
export const STREAM_INDICATOR_FEMALE_EMPLOYEES_NAME = 'Diversity & Inclusion 2022'; // Female employees (% of total staff)
export const STREAM_INDICATOR_SOCIAL_COMMITMENT_NAME = 'Social Commitment 2022'; // Hours dedicated to social responsibility initiatives (Hours per employee per annum)
export const STREAM_ETHICS_BREACH_NAME = 'Business ethics 2022'; // Open litigations?
export const STREAM_INDEPENDENT_DIRECTORS_NAME = 'Board independence 2022'; // % Board composition

export const STREAM_INDICATOR_RENEWABLE_ENERGY_AVERAGE_NAME = 'Renewable Energy 2022 (Average)'; // % of total energy use from renewables (average)
export const STREAM_INDICATOR_SCOPE_EMISSIONS_AVERAGE_NAME = 'Greenhouse Gas (GHG) Emissions 2022 (Average)'; // Mtons of CO2e p.a. (Co2 calculation from third party consultancy) (average)
export const STREAM_INDICATOR_FEMALE_EMPLOYEES_AVERAGE_NAME = 'Diversity & Inclusion 2022 (Average)'; // Female employees (% of total staff) (average)
export const STREAM_INDICATOR_SOCIAL_COMMITMENT_AVERAGE_NAME = 'Social Commitment 2022 (Average)'; // Hours dedicated to social responsibility initiatives (Hours per employee per annum) (average)
export const STREAM_ETHICS_BREACH_AVERAGE_NAME = 'Business ethics 2022 (Average)'; // Open litigations (average)
export const STREAM_INDEPENDENT_DIRECTORS_AVERAGE_NAME = 'Board independence 2022 (Average)'; // % Board composition (average)

export const STREAM_SUSTAINABILITY_GOALS_NAME = 'SDG Goals'; // Select the SDGs you aim to achieve with your activities.

export const STREAM_ORGANIZATION_ID_NAME = 'Organization ID'; //

export const sustainabilityGoalMap = (value: string): string | undefined => {
  switch (value) {
    case 'No Poverty':
      return 'goal_1.svg';
    case 'Zero Hunger':
      return 'goal_2.svg';
    case 'Good Health and Well Being':
      return 'goal_3.svg';
    case 'Quality Education':
      return 'goal_4.svg';
    case 'Gender Equality':
      return 'goal_5.svg';
    case 'Clean Water and Sanitation':
      return 'goal_6.svg';
    case 'Affordable and Clean Energy':
      return 'goal_7.svg';
    case 'Decent Work and Economic Growth':
      return 'goal_8.svg';
    case 'Industry, Innovation and Infrastructure':
      return 'goal_9.svg';
    case 'Reduced Inequalities':
      return 'goal_10.svg';
    case 'Sustainable Cities and Communities':
      return 'goal_11.svg';
    case 'Responsible Consumption and Production':
      return 'goal_12.svg';
    case 'Climate Action':
      return 'goal_13.svg';
    case 'Life Below Water':
      return 'goal_14.svg';
    case 'Life On Land':
      return 'goal_15.svg';
    case 'Peace, Justice and Strong Institutions':
      return 'goal_16.svg';
    case 'Partnerships for The Goals':
      return 'goal_17.svg';
    default:
      return undefined;
  }
};

const renewableEnergyDescription = `
    <p>Renewable energy is energy derived from natural sources that are replenished at a higher rate than they are consumed. Sunlight and wind, for example, are such sources that are constantly being replenished. Generating renewable energy creates far lower emissions than burning fossil fuels. Transitioning from fossil fuels, which currently account for the lion’s share of emissions, to renewable energy is key to addressing the climate crisis.</p>
    <br><p>“Renewable Energy” metric is the percentage of total energy use from renewables.</p>
  `;

const scopeEmissionsDescription = `
    <p>Scope 1 emissions are direct emissions from company-owned and controlled resources. In other words, emissions are released into the atmosphere as a direct result of a set of activities, at a firm level.</p>
    <br><p>“Scope 1 emissions” metric capture KPIs related to direct emissions from owned or controlled sources.</p>
  `;

const femaleEmployeesDescription = `
    <p>“Female employees” metric is related to the percentage of women in a company out of the total staff.</p>
  `;

const socialCommitmentDescription = `
    <p>“Social Commitment” metric is related to hours dedicated to social responsibility initiatives. Some examples are engaging in wildlife conservation initiatives, encouraging charity and volunteer work, supporting local communities, improving labor policies, ensuring diversity and equality in the workplace, investing in nonprofit organizations, and guaranteeing ethically sourced materials.</p>
  `;

const ethicsBreachDescription = `
    <p>“ethics breach” metric is related to the presence of open litigations for the company</p>
  `;

const ethicsBreachTooltip = `“ethics breach” metric is related to the presence of open litigations for the company`;

const independentDirectorDescription = `
    <p>An independent director, in corporate governance, refers to a member of a board of directors who does not have a material relationship with a company and is neither part of its executive team nor involved in the day-to-day operations of the company.</p>
    <br><p>“Independent director” metric is the percentage of independent directors in the board composition.</p>
  `;

export const indicatorDefinitions: { [indicator: string ]: IndicatorDefinition } = {
  renewableEnergy: {
    title: 'Renewable energy',
    type: 'env',
    icon: 'renewable-energy',
    unit: undefined,
    maximum: CHART_RENEWABLE_MAX,
    formatValue: 'percentage',
    description: renewableEnergyDescription,
    hasDialog: true,
    tooltip: undefined,
  },
  scopeEmissions: {
    title: 'CO2 scope 1 emissions',
    type: 'env',
    icon: 'c02-emissions',
    unit: 'CO2e kt',
    maximum: CHART_CO2_EMISSIONS_MAX,
    formatValue: undefined,
    description: scopeEmissionsDescription,
    hasDialog: true,
    tooltip: undefined,
  },
  femaleEmployees: {
    title: 'Female employees',
    type: 'soc',
    icon: 'female-employees',
    unit: undefined,
    maximum: CHART_FEMALE_EMPLOYEES_MAX,
    formatValue: 'percentage',
    description: femaleEmployeesDescription,
    hasDialog: true,
    tooltip: undefined,
  },
  socialCommitment: {
    title: 'Social commitment',
    type: 'soc',
    icon: 'social',
    unit: 'h/year',
    maximum: CHART_SOCIAL_COMMITMENT_MAX,
    formatValue: 'largeNumber',
    description: socialCommitmentDescription,
    hasDialog: true,
    tooltip: undefined,
  },
  ethicsBreach: {
    title: 'Business ethics breach',
    type: 'gov',
    icon: 'ethics',
    unit: 'open litigations',
    maximum: CHART_ETHICS_BREACH_MAX,
    formatValue: 'boolean',
    description: ethicsBreachDescription,
    hasDialog: false,
    tooltip: ethicsBreachTooltip,
  },
  independentDirector: {
    title: 'Independent directors',
    type: 'gov',
    icon: 'independent',
    unit: undefined,
    maximum: CHART_INDEPENDENT_DIRECTORS_MAX,
    formatValue: 'percentage',
    description: independentDirectorDescription,
    hasDialog: true,
    tooltip: undefined,
  },
};
