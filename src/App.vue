<template>
    <div id="app">
        <div class="container">
            <el-alert
                v-if="!hiddenTips"
                :title="tips"
                type="info"
                close-text="知道了"
                @close="handleCloseAlert">
            </el-alert>
            
            <div class="content">
                <el-form ref="MpForm" :model="form" label-width="80px" :rules="rules">
                    <el-form-item label="AppID" prop="appId">
                        <el-input v-model="form.appId" placeholder="请输入你的小程序 AppID" clearable></el-input>
                    </el-form-item>
                    
                    <el-form-item label="启动页面" prop="page">
                        <el-autocomplete
                            popper-class="my-autocomplete"
                            v-model="form.page"
                            :fetch-suggestions="handleSuggestion(suggestion.page)"
                            :placeholder="placeholder.page"
                            @select="handleSelectPage"
                            clearable
                        >
                            <template slot-scope="{ item }">
                                <div class="description">{{ item.description }}</div>
                                <span class="value">{{ item.value }}</span>
                            </template>
                        </el-autocomplete>
                    </el-form-item>
                    
                    <el-form-item label="接口类型">
                        <el-radio-group v-model="form.apiType" @change="handleChangeRadio">
                            <el-radio label="A">A接口</el-radio>
                            <el-radio label="B">B接口(参数都放在scene字段)</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    
                    <el-form-item label="页面参数">
                        <el-autocomplete
                            popper-class="my-autocomplete"
                            v-model="form.params"
                            :fetch-suggestions="handleSuggestion(suggestion.params)"
                            :placeholder="placeholder.params"
                            @select="handleSelectParam"
                            clearable
                        >
                            <template slot-scope="{ item }">
                                <div class="description">{{ item.description }}</div>
                                <span class="value">{{ item.value }}</span>
                            </template>
                        </el-autocomplete>
                    </el-form-item>
                    
                    <el-form-item>
                        <el-button type="primary" @click="handleClickBtn">生成二维码</el-button>
                        <el-button type="primary" @click="handleCopyQrCodeLink">复制当前二维码链接</el-button>
                    </el-form-item>
                </el-form>
                <div class="qrcode">
                    <vue-qr
                        :text="qrCode.url"
                        :correctLevel="3"
                        :size="250"
                        colorDark="#303133"
                        colorLight="white"
                        :logoSrc="qrCode.logo"
                        :logoScale=".2"
                        :logoCornerRadius="22.5"
                        :logoMargin="5"
                    ></vue-qr>
                    <div class="qrcode-info">
                        <div>{{resultText.join('')}}</div>
                        <div>update time: {{qrCode.curTime}}</div>
                    </div>
                
                </div>
            </div>
        
        
        </div>
    </div>
</template>

<script>
    import vueQr from 'vue-qr'
    import { formatDate } from '@/utils/dateTime'
    
    export default {
        name: 'App',
        components: {
            vueQr
        },
        data () {
            return {
                tips: '这里仅做模拟带参数的入口（如小程序码、卡片、公众号跳转）在体验版上的跳转，场景值为 1017，跟实际可能会有差别，仅做测试用',
                hiddenTips: false,
                form: {
                    appId: '',
                    page: '',
                    apiType: 'A',
                    params: '',
                },
                suggestion: {
                    page: [{ 'value': 'pages/index/index', 'description': '首页' }],
                    params: [{ 'value': 'name=mocobk&age=18', 'description': '示例参数1' }]
                },
                rules: {
                    appId: [{ required: true, message: '请输入AppID', trigger: 'change' }],
                    page: [{ required: true, message: '请输入页面路径', trigger: 'change' }],
                },
                placeholder: {
                    page: '输入页面路径: pages/index/main',
                    params: '输入页面参数: name=mocobk&from=wechat',
                },
                qrCode: {
                    url: 'pages/index/main',
                    logo: 'http://mocobk.test.upcdn.net/image/20201022103216926.jpg',
                    curTime: formatDate(new Date().getTime())
                }
            }
        },
        created () {
            this.hiddenTips = window.localStorage.getItem('hiddenTips')
            const pageHistory = window.localStorage.getItem('pageHistory')
            this.suggestion.page = pageHistory ? JSON.parse(pageHistory) : this.suggestion.page
        },
        computed: {
            resultText () {
                const params = this.form.apiType === 'B' ? `scene=${encodeURIComponent(this.form.params)}` : this.form.params
                const querySplitChar = this.form.params.trim() ? '?' : ''
                return [this.form.page, querySplitChar, params]
            }
        },
        methods: {
            handleChangeRadio (value) {
                if (value === 'B') {
                    this.placeholder.params = '输入页面参数: 1075117544081326080,OPERATION'
                } else {
                    this.placeholder.params = '输入页面参数: name=mocobk&from=wechat'
                }
            },
            
            handleSuggestion (dataList) {
                return (queryString, cb) => {
                    const results = queryString ? dataList.filter(this.createFilter(queryString)) : dataList
                    // 调用 callback 返回建议列表的数据
                    cb(results)
                }
            },
            
            createFilter (queryString) {
                return (item) => {
                    return (item.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
                }
            },
            handleSelectPage (item) {
                if (item.type) {
                    this.form.apiType = item.type
                }
                if (item.params) {
                    this.form.params = item.params
                }
            },
            handleSelectParam (item) {
                if (item.type) {
                    this.form.apiType = item.type
                }
            },
            handleClickBtn () {
                this.$refs['MpForm'].validate((valid) => {
                    if (valid) {
                        const path = [this.resultText[0], '.html', ...this.resultText.slice(1)].join('')
                        this.qrCode.url = `https://open.weixin.qq.com/sns/getexpappinfo?appid=${this.form.appId}&path=${encodeURIComponent(path)}`
                        this.qrCode.curTime = formatDate(new Date().getTime())
                        this.$message.success('二维码创建成功')
                        const pageHistory = {description: this.resultText.join(''),value: this.form.page, type: this.form.apiType, params: this.form.params}
                        const isHistoryExist = this.suggestion.page.some(item=>{
                            return item.value === this.form.page && item.type === this.form.apiType && item.params === this.form.params
                        })
                        if (!isHistoryExist){
                           this.suggestion.page = [pageHistory, ...this.suggestion.page].slice(0, 8)
                            window.localStorage.setItem('pageHistory', JSON.stringify(this.suggestion.page))
                        }
                        
                    }
                })
            },
            handleCopyQrCodeLink () {
                this.$copyText(this.qrCode.url).then(() => {
                    this.$message.success('链接复制成功，可在手机、PC微信上粘贴打开')
                }, e => {
                    this.$message.error('链接复制失败')
                    console.error(e)
                })
            },
            handleCloseAlert () {
                window.localStorage.setItem('hiddenTips', 'true')
            }
        }
        
    }
</script>
<style lang="scss">
    .my-autocomplete {
        li {
            line-height: normal;
            padding: 7px;
            
            .description {
                text-overflow: ellipsis;
                overflow: hidden;
            }
            
            .value {
                font-size: 12px;
                color: #b4b4b4;
            }
            
            .highlighted .value {
                color: #ddd;
            }
        }
    }

</style>

<style lang="scss" scoped>
    
    .container {
        min-height: -webkit-fill-available;
        width: 80%;
        margin: auto;
        
        .el-alert {
            margin-bottom: 20px;
        }
        
        .content {
            overflow-y: auto;
            position: relative;
            display: flex;
            justify-content: space-between;
            
            .el-form {
                width: 60%;
                margin-top: 30px;
                
                .el-autocomplete {
                    width: 100%;
                }
                
            }
            
            .qrcode {
                width: 40%;
                padding: 10px;
                text-align: center;
                
                .qrcode-info {
                    font-size: 12px;
                    color: #b4b4b4;
                    
                    div {
                        margin: 5px auto;
                        width: 300px;
                        word-break: break-all
                        
                    }
                    
                }
            }
        }
    }


</style>
