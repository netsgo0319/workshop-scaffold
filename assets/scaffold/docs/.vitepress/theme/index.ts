import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import './custom.css'

import Screenshot from './components/Screenshot.vue'
import Video from './components/Video.vue'
import FeatureMeta from './components/FeatureMeta.vue'
import ScenarioCard from './components/ScenarioCard.vue'
import FeatureGrid from './components/FeatureGrid.vue'
import FeatureLinks from './components/FeatureLinks.vue'
import FlowMap from './components/FlowMap.vue'
import DownloadButton from './components/DownloadButton.vue'
import Checklist from './components/Checklist.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('Screenshot', Screenshot)
    app.component('Video', Video)
    app.component('FeatureMeta', FeatureMeta)
    app.component('ScenarioCard', ScenarioCard)
    app.component('FeatureGrid', FeatureGrid)
    app.component('FeatureLinks', FeatureLinks)
    app.component('FlowMap', FlowMap)
    app.component('DownloadButton', DownloadButton)
    app.component('Checklist', Checklist)
  },
} satisfies Theme
