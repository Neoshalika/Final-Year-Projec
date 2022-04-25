package bit.project.server.dao;

import org.springframework.data.domain.Page;
import bit.project.server.entity.Customerrefund;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported=false)
public interface CustomerrefundDao extends JpaRepository<Customerrefund, Integer>{
    @Query("select new Customerrefund (c.id,c.code,c.customerorder,c.date,c.amount,c.chequeno,c.chequebank) from Customerrefund c")
    Page<Customerrefund> findAllBasic(PageRequest pageRequest);

    Customerrefund findByCode(String code);
}