/* eslint-disable import/order */
import '@/utils/highlight';
import ReactQuill, { ReactQuillProps } from 'react-quill';
import Toolbar, { formats } from './toolbar';
import { useSettings } from '@/store/settingStore';
import { useThemeToken } from '@/theme/hooks';
import { StyledEditor } from './styles';
import { ItemReq, useAdd } from '@/api/services/uploadImgService';
import { useState, useMemo, useRef, useEffect } from 'react';

interface Props extends ReactQuillProps {
  sample?: boolean;
  onChange: (newValue: string) => void // 通过参数传给父组件的值
}

export default function Editor({ id = 'slash-quill', sample = false, ...other }: Props) {
  const token = useThemeToken();
  const { themeMode } = useSettings();
  // 新数据进来时填充value
  const [contentCn, setContentCn] = useState(); // 富文本内容
  useEffect(() => {
    setContentCn(other.value);
  }, [other.value]);

  //修改数据时更新父组件的值
  useEffect(() => {
    if (typeof contentCn === 'string'){
      other.onChange(contentCn);
    }
  }, [contentCn]);

  const modules = useMemo(() => ({
    toolbar: {
      container: `#${id}`,
    },
    history: {
      delay: 500,
      maxStack: 100,
      userOnly: true,
    },
    syntax: true,
    clipboard: {
      matchVisual: false,
    },
  }), []);

  const add = useAdd();
  const reactQuillRef = useRef<any>(null);

  return (
    <StyledEditor $token={token} $thememode={themeMode}>
      <Toolbar id={id} isSimple={sample} />
      <ReactQuill
        ref={reactQuillRef}
        placeholder="请输入..."
        theme="snow"
        formats={formats}
        modules={modules}
        {...other}
        value={contentCn}
        onChange={(content, delta, source, editor) => {
          console.log(source);
          // 如下代码可解决 图片粘贴后为base64,上传至服务器文件过大，所以需要将base64格式图片进行转换，具体方法如下：
          let delta_ops = delta.ops;
          let quilContent = editor.getContents();
          if (delta_ops && delta_ops.length) {
            quilContent?.ops?.map((item) => {
              if (item.insert) {
                let imgStr = item.insert.image;
                if (imgStr && imgStr?.includes(';base64,')) {
                  console.log(imgStr);
                  const imgReq: ItemReq = {
                    'source': "3",
                    'type': "3",
                    'file': imgStr,
                  }
                  add(imgReq).then((resImg) => {
                    // 我这里的 res.full_path是图片的url
                    // console.log("获取到的callback", resImg);
                    if (resImg && Reflect.has(resImg,'full_path')){
                      item.insert.image = resImg.full_path;
                      // @ts-ignore
                      setContentCn(quilContent);
                    }else {
                      console.log("fail")
                    }

                  });
                }else {
                  setContentCn(content);
                }
              }
            });
          }
        }}
      />
    </StyledEditor>
  );
}
