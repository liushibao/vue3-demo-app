// 姓名、手机号、身份号、出生日期、验证码
export class User {
  name: string | null = null;
  mob: string | null = null;
  idCardNumber: string | null = null;
  birthday: string | null = null;

  get isNamePass(): boolean {
    const rex = /^(?:[\u4e00-\u9fa5·]{2,16})$/;
    return this.name != null && rex.test(this.name);
  }

  get isMobPass(): boolean {
    const rex = /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1589]))\d{8}$/;

    return this.mob != null && rex.test(this.mob);
  }

  get isBirthdayPass(): boolean {
    if (this.birthday == null)
      return false;
    try {
      const now = new Date();
      const b = new Date(this.birthday);
      if (b > now)
        return false;
      const diff = (now.getFullYear() - b.getFullYear());
      return now > b && diff < 120;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return false;
    }
  }

  get isIdCardNumberPass(): boolean {
    if (this.idCardNumber?.length != 18 || !/^\d{17}$/.test(this.idCardNumber.slice(0, 17)))
      return false;

    const address = "11x22x35x44x53x12x23x36x45x54x13x31x37x46x61x14x32x41x50x62x15x33x42x51x63x21x34x43x52x64x65x71x81x82x91";

    if (!address.includes(this.idCardNumber.slice(0, 2)))
      return false;

    // a1与对应的校验码对照表，其中key表示a1，value表示校验码，value中的10表示校验码X
    const a1Map: { [propName: string]: number } = {
      0: 1,
      1: 0,
      2: 10,
      3: 9,
      4: 8,
      5: 7,
      6: 6,
      7: 5,
      8: 4,
      9: 3,
      10: 2
    };
    const idStr = this.idCardNumber.toUpperCase();
    const reg = /^[0-9]{17}[0-9X]$/;
    if (!reg.test(idStr)) {
      return false;
    }
    let sum = 0;
    let signChar = '';
    for (let index = 0; index < idStr.length; index++) {
      const i = 18 - index;
      const c = idStr.charAt(index);
      let v;
      let weight;
      if (i != 1) {
        v = parseInt(c)
        if (!isNaN(v)) {
          // 计算加权因子
          weight = parseInt(String(Math.pow(2, parseFloat(String(i - 1))))) % 11;
          sum += (v * weight);
        } else {
          return false;
        }
      } else {
        signChar = c.toString();
      }
    }
    const a1 = a1Map[sum % 11];
    let a1Str = a1.toString();
    if (a1 == 10) {
      a1Str = 'X';
    }
    const isRedundancyPass = a1Str === signChar;

    return isRedundancyPass;
  }

  get isBirthdayEqual() {
    return this.birthday?.replace(/-/g, "") == this.idCardNumber?.slice(6, 14);
  }

  get isValid() {
    return this.isNamePass && this.isMobPass && this.isBirthdayPass && this.isIdCardNumberPass && this.isBirthdayEqual;
  }

  get errors() {
    const errors: Record<string, string[]> = {
      name: [],
      mob: [],
      idCardNumber: [],
      birthday: [],
    };
    if (this.isMobPass != true)
      errors.mob = ["手机号格式错误"];
    if (this.mob == null)
      errors.mob = ["请填写手机号"];
    if (this.isNamePass != true)
      errors.name = ["姓名格式错误"];
    if (this.name == null)
      errors.name = ["请填写姓名"];
    if (this.isBirthdayEqual != true)
      errors.birthday = ["身份证日期和生日不一致"];
    if (this.isBirthdayPass != true)
      errors.birthday = ["生日格式错误"];
    if (this.birthday == null)
      errors.birthday = ["请填写生日"];
    if (this.isIdCardNumberPass != true)
      errors.idCardNumber = ["身份证号格式错误"];
    if (this.idCardNumber == null)
      errors.idCardNumber = ["请填写身份证号"];
    return errors;
  }
}
