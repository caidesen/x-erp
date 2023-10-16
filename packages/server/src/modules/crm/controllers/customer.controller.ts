import { Controller } from "@nestjs/common";
import { Customer, CustomerContactInfo } from "../entities/customer.entity";
import { EntityRepository } from "@mikro-orm/postgresql";
import { InjectRepository } from "@mikro-orm/nestjs";
import {
  CreateCustomerInput,
  CustomerVO,
  QueryCustomerInput,
  UpdateCustomerInput,
} from "../dto/customer.dto";
import { IdsOnly } from "@/common/dto";
import { TypedBody, TypedRoute } from "@nestia/core";
import { Reference, serialize } from "@mikro-orm/core";
import _ from "lodash";
import { User } from "@/modules/system/auth/entities/user.entity";
import { getPageableParams } from "@/common/helpers/pagination";
import { queryCondBuilder } from "@/common/db/query-cond-builder";
import { defaultOrderBy } from "@/common/db/orderBy";

const { Post } = TypedRoute;

@Controller("crm/customer")
export class CustomerController {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: EntityRepository<Customer>,
    @InjectRepository(CustomerContactInfo)
    private readonly customerContactInfoRepository: EntityRepository<CustomerContactInfo>
  ) {}

  @Post("list")
  async list(
    @TypedBody() input: QueryCustomerInput
  ): Promise<{ list: CustomerVO[]; total: number }> {
    const { offset, limit } = getPageableParams(input);
    const cond = queryCondBuilder<Customer>()
      .like("fullName", input.fullName)
      .like("shortName", input.shortName)
      .if(input.personInChargeUser?.nickname, {
        personInChargeUser: {
          nickname: { $like: `%${input.personInChargeUser?.nickname}%` },
        },
      })
      .eq("region", input.region)
      .eq("property", input.property).cond;
    const qb = this.customerRepository
      .createQueryBuilder("c0")
      .select("*")
      .leftJoinAndSelect("c0.personInChargeUser", "p0")
      .leftJoinAndSelect("c0.contacts", "c1")
      .limit(limit, offset)
      .orderBy(defaultOrderBy);
    const [list, total] = await qb.where(cond).getResultAndCount();
    return {
      list: serialize(list, {
        populate: true,
      }) as unknown as CustomerVO[],
      total,
    };
  }

  @Post("create")
  async create(@TypedBody() input: CreateCustomerInput) {
    const customer = new Customer();
    Object.assign(
      customer,
      _.omit(input, ["contacts", "personInChargeUserId"])
    );
    customer.personInChargeUser = Reference.createFromPK(
      User,
      input.personInChargeUserId
    );
    const contacts = input.contacts.map((it) => new CustomerContactInfo(it));
    customer.contacts.set(contacts);
    await this.customerRepository.getEntityManager().persistAndFlush(customer);
  }

  @Post("update")
  async update(@TypedBody() input: UpdateCustomerInput) {
    const customer = await this.customerRepository.findOneOrFail(input.id, {
      populate: ["contacts", "personInChargeUser"],
    });
    this.customerRepository.assign(
      customer,
      _.omit(input, ["contacts", "personInChargeUserId"])
    );
    if (input.personInChargeUserId !== undefined) {
      // customer.personInChargeUser = this.customerRepository
      //   .getEntityManager()
      //   .getReference(User, input.personInChargeUserId);
      // customer.personInChargeUser.set(
      //   Reference.createFromPK(User, input.personInChargeUserId)
      // );
      this.customerRepository.assign(customer, {
        personInChargeUser: Reference.createFromPK(
          User,
          input.personInChargeUserId
        ),
      });
    }
    if (input.contacts) {
      this.customerRepository.assign(customer, { contacts: input.contacts });
      // const contacts = await this.customerContactInfoRepository.upsertMany(
      //   input.contacts.map(
      //     (it) =>
      //       new CustomerContactInfo({
      //         ...it,
      //         customer: ref(customer),
      //       })
      //   )
      // );
      // customer.contacts.set(contacts);
    }
    await this.customerRepository.getEntityManager().persistAndFlush(customer);
  }

  @Post("batchRemove")
  async batchRemove(@TypedBody() input: IdsOnly) {
    const customers = await this.customerRepository.find(
      { id: input.ids },
      { populate: ["contacts"] }
    );
    await this.customerRepository.getEntityManager().remove(customers).flush();
  }
}
