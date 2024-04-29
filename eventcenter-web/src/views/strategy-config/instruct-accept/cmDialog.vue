<!--
 * @description 策略配置弹窗
 * @date 2020-08-18
 * @author lism
-->
<template>
  <el-dialog
    title="查看指令"
    :visible.sync="isShowDig"
    width="660px"
    :before-close="handleClose"
    :close-on-click-modal="false"
  >
    <div>
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        :disabled="mode === 'view'"
        label-position="top"
        label-width="100px"
        class="demo-ruleForm"
      >
        <div class="title-deliver">指令详情</div>
        <div class="form-item-wrap">
          <span class="form-label">指令标题：</span>
          <span class="form-item-con">{{ detailObj.title }}</span>
        </div>
        <div class="form-item-wrap">
          <span class="form-label">指令时间：</span>
          <span class="form-item-con">{{ detailObj.commandTime }}</span>
        </div>
        <div class="form-item-wrap">
          <span class="form-label">指令状态：</span>
          <span class="form-item-con">{{ detailObj.commandStatusName }}</span>
        </div>
        <div class="form-item-wrap">
          <span class="form-label">指令附件：</span>
          <event-media :event-media="detailObj.sendMediaList" :show-download="false" style="margin-top:10px;" />
        </div>
        <div class="title-deliver" style="margin:20px 0;">指令反馈</div>
        <!-- 反馈 -->
        <template v-if="mode !== 'view'">
          <el-form-item class="width100" label="反馈内容" prop="replyContent">
            <el-input
              v-model="ruleForm.replyContent"
              class="width100"
              maxlength="500"
              type="textarea"
              :rows="3"
              show-word-limit
              placeholder="请输入反馈内容"
            />
          </el-form-item>
          <el-form-item label="反馈附件" prop="mediaList">
            <cestc-upload
              accept=".png,.jpg,.jpeg"
              :media-list="ruleForm.mediaList"
              :limit-size="50"
              :limit="9"
              @eventMedia="updateEventMedia"
            >
              <span slot="tips">请上传图片，大小不能超过50M</span>
            </cestc-upload>
          </el-form-item>
        </template>
        <template v-else>
          <div class="form-item-wrap" style="display:flex;flex-direction:column;gap:10px;">
            <span class="form-label">反馈内容：</span>
            <span class="form-item-con">{{ detailObj.replyContent }}</span>
          </div>
          <div class="form-item-wrap">
            <span class="form-label">反馈附件：</span>
            <event-media :event-media="detailObj.replyMediaList" :show-download="false" style="margin-top:10px;" />
          </div>
        </template>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button v-if="mode === 'edit'" type="primary" @click="_confirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import moduleSrv from '@/api/dispatchWhh'
import cestcUpload from '@/components/CestcUpload'
import eventMedia from '@/components/EventInfo/eventMedia.vue'

export default {
  name: 'CmDialog',
  components: {
    cestcUpload,
    eventMedia
  },
  props: {
    mode: {
      type: String,
      default: ''
    },
    editingdata: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      isShowDig: false,
      detailObj: {},
      ruleForm: {
        replyContent: '',
        mediaList: []
      },
      rules: {
        replyContent: [
          { required: true, message: '请输入反馈内容', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    '$attrs.visible': {
      immediate: true,
      async handler(nval) {
        await this.$nextTick()
        this.isShowDig = nval
        if (this.isShowDig) {
          this.$refs['ruleForm'].clearValidate()
        }
      }
    }
  },
  created() {
    this.getdetail()
  },
  methods: {
    async getdetail() {
      const { data } = await moduleSrv.getReceiveDetail(this.editingdata)
      this.detailObj = data
      this.detailObj.sendMediaList = data.sendMediaList.map((image) => {
        return {
          ...image,
          mediaType: 'image'
        }
      })
      this.detailObj.replyMediaList = data.replyMediaList.map((image) => {
        return {
          ...image,
          mediaType: 'image'
        }
      })
    },
    updateEventMedia(fileList = []) {
      console.log(fileList)
      this.$set(this.ruleForm, 'mediaList', fileList)
    },
    handleClose(done) {
      this.isShowDig = false
      this.$parent.dialogVisible = false
    },
    // 提交
    async _confirm() {
      await this.$refs['ruleForm'].validate()
      const params = {
        ...this.ruleForm,
        id: this.editingdata.id
      }
      await moduleSrv.postReceiveReply(params)
      this.$parent._search()
      this.$message.success('反馈成功')
      this.isShowDig = false
      this.$parent.dialogVisible = false
    }
  }
}
</script>
<style scoped lang="scss">
.width50 {
  width: 48%;
}

.width100 {
  width: 100%;
}

.title-deliver {
  font-size: 18px;
  position: relative;
  padding-left: 20px;
  display: flex;
  align-items: center;
  height: 20px;
  font-weight: bold;

  &:before {
    position: absolute;
    top: 0px;
    left: 0;
    content: '';
    width: 4px;
    height: 18px;
    background: #6E9ECC;
  }
}

.form-item-wrap {
  margin-top: 20px;
  font-size: 14px;
  line-height: 24px;

  .form-label {
    font-weight: bold;
    margin-right: 6px;
  }
}
</style>
