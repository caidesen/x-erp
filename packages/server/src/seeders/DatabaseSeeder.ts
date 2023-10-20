import { EntityData, type EntityManager, ref, wrap } from "@mikro-orm/core";
import { Factory, Faker, Seeder } from "@mikro-orm/seeder";
import { User } from "@/modules/system/auth/entities/user.entity";
import { Account } from "@/modules/system/auth/entities/account.entity";
import { Role } from "@/modules/system/auth/entities/role.entity";
import Bcrypt from "bcrypt";
import {
  Customer,
  CustomerContactInfo,
} from "@/modules/crm/entities/customer.entity";
import { Unit } from "@/modules/system/config/unit/entities/unit.entity";
import { Product } from "@/modules/wms/entities/product.entity";
import { Warehouse } from "@/modules/wms/entities/warehouse.entity";

/**
 * 系统配置相关
 */
class SystemSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const role = new Role();
    role.id = "0";
    role.name = "管理员";
    role.description = "系统管理员";
    role.permissions = ["*"];
    em.persist(role);
    const user = new User();
    user.nickname = "admin";
    const account = new Account();
    account.username = "admin";
    account.password = await Bcrypt.hash("123456", 10);
    user.account = wrap(account).toReference();
    user.roles.add(role);
    em.persist(user);
    await em.flush();
  }
}

/**
 * 客户联系人工厂
 */
export class CustomerContactInfoFactory extends Factory<CustomerContactInfo> {
  model = CustomerContactInfo;

  protected definition(faker: Faker): EntityData<CustomerContactInfo> {
    faker.setLocale("zh_CN");
    return {
      address: faker.address.streetAddress(),
      name: faker.name.fullName(),
      phone: faker.phone.number(),
    };
  }
}

/**
 * 生成假客户
 */
class CustomerSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const list = [
      {
        shortName: "武汉中地",
        fullName: "武汉中地数码科技有限公司",
        remarks: "测试客户",
        region: "武汉",
        personInChargeUser: ref(User, "1"),
        property: "长期客户",
      },
      {
        shortName: "腾讯",
        fullName: "腾讯控股有限公司",
        remarks: "测试客户",
        region: "深圳",
        personInChargeUser: ref(User, "1"),
        property: "长期客户",
      },
    ];
    await em.persistAndFlush(
      list.map((it) => {
        const customer = new Customer();
        Object.assign(customer, it);
        customer.contacts.set(new CustomerContactInfoFactory(em).make(5));
        return customer;
      })
    );
  }
}

/**
 * 生成默认的配置
 */
class ConfigSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const presetUnits: Partial<Unit>[] = [
      {
        name: "个",
        abbreviation: "",
        decimals: 0,
      },
      {
        name: "克",
        abbreviation: "g",
        decimals: 0,
      },
      {
        name: "千克",
        abbreviation: "kg",
        decimals: 0,
      },
      {
        name: "斤",
        abbreviation: "",
        decimals: 0,
      },
    ];
    await em.persistAndFlush(presetUnits.map((it) => new Unit(it)));
  }
}

class ProductSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const unit = await em.findOne(Unit, { name: "个" });
    if (!unit) {
      throw new Error("未找到默认的计量单位");
    }
    const list: Partial<Product>[] = [
      {
        name: "苹果",
        remarks: "苹果",
        multiUnitEnabled: false,
      },
      {
        name: "香蕉",
        remarks: "香蕉",
        multiUnitEnabled: false,
      },
    ];
    await em.persistAndFlush(
      list.map((it) => {
        const product = new Product(it);
        product.baseUnit = ref(unit);
        return product;
      })
    );
  }
}

class WMSSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const warehouse = new Warehouse({
      name: "测试仓库",
      remarks: "测试仓库",
    });
    await em.persistAndFlush(warehouse);
    return this.call(em, [ProductSeeder]);
  }
}

export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    return this.call(em, [
      SystemSeeder,
      CustomerSeeder,
      ConfigSeeder,
      WMSSeeder,
    ]);
  }
}
