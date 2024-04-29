<template>
  <hl-panel class="w-full bg-body" padding="0">
    <hl-group class="w-full" dir="vertical" gap="var(--lg)">
      <hl-row class="w-full" layout="grid" count="count-5 " gap="var(--xl)">
        <hl-col span="col">
          <hb-data-collect
            gap="var(--md)"
            padding="var(--xl)"
            full="full-x"
            class="resource-class01"
            style="height: calc(var(--xxs) * 30)"
          >
            <img
              :src="icon011"
              alt="icon"
              style="
                width: calc(var(--xxs) * 15);
                height: calc(var(--xxs) * 15);
                flex-grow: inherit;
              "
            />
            <hl-group dir="vertical" full="full-x" gap="var(--xs)">
              <hl-group gap="var(--sm)">
                <span class="font-xl font-bold text-inverse">接报事项</span>
                <span class="font-xl font-bold text-inverse">38</span>
              </hl-group>
              <hl-group gap="var(--sm)">
                <span class="text-inverse">环比</span>
                <hl-group align="items-left items-middle" gap="var(--xxs)">
                  <span class="font-bold text-inverse">3%</span>
                  <img
                    :src="icon09"
                    alt="icon"
                    style="
                      width: calc(var(--xxs) * 3);
                      height: calc(var(--xxs) * 3);
                      flex-grow: inherit;
                    "
                  />
                </hl-group>
              </hl-group>
            </hl-group>
          </hb-data-collect>
        </hl-col>
        <hl-col span="col">
          <hb-data-collect
            gap="var(--md)"
            padding="var(--xl)"
            full="full-x"
            class="resource-class02"
            style="height: calc(var(--xxs) * 30)"
          >
            <img
              :src="icon022"
              alt="icon"
              style="
                width: calc(var(--xxs) * 15);
                height: calc(var(--xxs) * 15);
                flex-grow: inherit;
              "
            />
            <hl-group dir="vertical" full="full-x" gap="var(--xs)">
              <hl-group gap="var(--sm)">
                <span class="font-xl font-bold text-inverse">已受理</span>
                <span class="font-xl font-bold text-inverse">33</span>
              </hl-group>
              <hl-group gap="var(--sm)">
                <span class="text-inverse">待受理</span>
                <span class="font-bold text-inverse">5</span>
              </hl-group>
            </hl-group>
          </hb-data-collect>
        </hl-col>
        <hl-col span="col">
          <hb-data-collect
            gap="var(--md)"
            padding="var(--xl)"
            full="full-x"
            class="resource-class03"
            style="height: calc(var(--xxs) * 30)"
          >
            <img
              :src="icon033"
              alt="icon"
              style="
                width: calc(var(--xxs) * 15);
                height: calc(var(--xxs) * 15);
                flex-grow: inherit;
              "
            />
            <hl-group dir="vertical" full="full-x" gap="var(--xs)">
              <hl-group gap="var(--sm)">
                <span class="font-xl font-bold text-inverse">处置中</span>
                <span class="font-xl font-bold text-inverse">15</span>
              </hl-group>
              <hl-group gap="var(--xl)">
                <hl-group gap="var(--sm)">
                  <span class="text-inverse">转派</span>
                  <span class="font-bold text-inverse">9</span>
                </hl-group>
                <hl-group gap="var(--sm)">
                  <span class="text-inverse">督办</span>
                  <span class="font-bold text-inverse">6</span>
                </hl-group>
              </hl-group>
            </hl-group>
          </hb-data-collect>
        </hl-col>
        <hl-col span="col">
          <hb-data-collect
            gap="var(--md)"
            padding="var(--xl)"
            full="full-x"
            class="resource-class04"
            style="height: calc(var(--xxs) * 30)"
          >
            <img
              :src="icon044"
              alt="icon"
              style="
                width: calc(var(--xxs) * 15);
                height: calc(var(--xxs) * 15);
                flex-grow: inherit;
              "
            />
            <hl-group dir="vertical" full="full-x" gap="var(--xs)">
              <hl-group gap="var(--sm)">
                <span class="font-xl font-bold text-inverse">已结案</span>
                <span class="font-xl font-bold text-inverse">18</span>
              </hl-group>
              <hl-group gap="var(--sm)">
                <span class="text-inverse">结案率</span>
                <hl-group align="items-left items-middle" gap="var(--xxs)">
                  <span class="font-bold text-inverse">93%</span>
                </hl-group>
              </hl-group>
            </hl-group>
          </hb-data-collect>
        </hl-col>
        <hl-col span="col">
          <hb-data-collect
            gap="var(--md)"
            padding="var(--xl)"
            full="full-x"
            class="resource-class05"
            style="height: calc(var(--xxs) * 30)"
          >
            <img
              :src="icon055"
              alt="icon"
              style="
                width: calc(var(--xxs) * 15);
                height: calc(var(--xxs) * 15);
                flex-grow: inherit;
              "
            />
            <hl-group dir="vertical" full="full-x" gap="var(--xs)">
              <hl-group gap="var(--sm)">
                <span class="font-xl font-bold text-inverse">调用策略</span>
                <span class="font-xl font-bold text-inverse">35次</span>
              </hl-group>
              <hl-group gap="var(--sm)">
                <hl-group gap="var(--xs)">
                  <span class="text-inverse">智能匹配</span>
                  <span class="font-bold text-inverse">30</span>
                </hl-group>
                <hl-group gap="var(--xs)">
                  <span class="text-inverse">人工调度</span>
                  <span class="font-bold text-inverse">5</span>
                </hl-group>
              </hl-group>
            </hl-group>
          </hb-data-collect>
        </hl-col>
        <hl-col span="col-span-2">
          <EventLevel />
        </hl-col>
        <hl-col span="col-span-3">
          <ProcessingEvent />
        </hl-col>
        <hl-col span="col-span-2">
          <EventTrends />
        </hl-col>
        <hl-col span="col-span-3">
          <hl-row gap="var(--xl)">
            <hl-col span="xl:col-16 xxl:col-15 ">
              <Statistics />
            </hl-col>
            <hl-col span="xl:col-8 xxl:col-9 ">
              <RecentMeeting />
            </hl-col>
          </hl-row>
        </hl-col>
        <hl-col span="col-span-2">
          <EventType />
        </hl-col>
        <hl-col span="col-span-3">
          <hl-row gap="var(--xl)">
            <hl-col span="xl:col-16 xxl:col-15 ">
              <KnowledgeManagement />
            </hl-col>
            <hl-col span="xl:col-8 xxl:col-9 ">
              <DisposalStrategy />
            </hl-col>
          </hl-row>
        </hl-col>
      </hl-row>
    </hl-group>
  </hl-panel>
</template>

<script lang="ts" setup>
import {
  EventTrends,
  EventLevel,
  EventType,
  ProcessingEvent,
  Statistics,
  RecentMeeting,
  KnowledgeManagement,
  DisposalStrategy,
} from './components';
import icon011 from '../../assets/images/home-page/icon-01-01.png';
import icon022 from '../../assets/images/home-page/icon-02-01.png';
import icon033 from '../../assets/images/home-page/icon-03-01.png';
import icon044 from '../../assets/images/home-page/icon-04-01.png';
import icon055 from '../../assets/images/home-page/icon-05-01.png';
import icon09 from '../../assets/images/home-page/icon-09.png';
</script>

<style scoped lang="scss">
.resource {
  &-class01 {
    background: url("../../assets/images/home-page/icon-01.png");
    background-size: cover;
  }

  &-class02 {
    background: url("../../assets/images/home-page/icon-02.png");
    background-size: cover;
  }

  &-class03 {
    background: url("../../assets/images/home-page/icon-03.png");
    background-size: cover;
  }

  &-class04 {
    background: url("../../assets/images/home-page/icon-04.png");
    background-size: cover;
  }

  &-class05 {
    background: url("../../assets/images/home-page/icon-05.png");
    background-size: cover;
  }
}
</style>
