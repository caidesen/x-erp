import { EntityData, type EntityManager, wrap } from "@mikro-orm/core";
import { Factory, Faker, Seeder } from "@mikro-orm/seeder";
import { User } from "@/modules/system/auth/entities/user.entity";
import { Account } from "@/modules/system/auth/entities/account.entity";
import { Role } from "@/modules/system/auth/entities/role.entity";
import Bcrypt from "bcrypt";
import {
  Customer,
  CustomerContactInfo,
} from "@/modules/crm/entities/customer.entity";
import { MeasurementUnit } from "@/modules/system/config/measure/entities/measurement-unit.entity";

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
 * 客户工厂
 */
export class CustomerFactory extends Factory<Customer> {
  model = Customer;

  definition(faker: Faker): Partial<Customer> {
    faker.setLocale("zh_CN");
    return {
      fullName: faker.company.name(),
      shortName: faker.company.companySuffix(),
      property: faker.company.bs(),
      region: faker.address.country(),
      remarks: faker.lorem.sentence(),
    };
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
    new CustomerFactory(em)
      .each((it) => {
        it.contacts.set(new CustomerContactInfoFactory(em).make(5));
      })
      .make(100);
  }
}

/**
 * 生成默认的配置
 */
class ConfigSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const presetUnits: Partial<MeasurementUnit>[] = [
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
      {
        name: "个",
        abbreviation: "",
        decimals: 0,
      },
    ];
    await em.persistAndFlush(presetUnits.map((it) => new MeasurementUnit(it)));
  }
}

export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    return this.call(em, [SystemSeeder, CustomerSeeder, ConfigSeeder]);
  }
}